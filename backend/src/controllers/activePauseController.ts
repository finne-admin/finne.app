import { Request, Response } from "express"
import { getPool } from "../config/dbManager"
import {
  ActivePauseNotFoundError,
  ActivePauseForbiddenError,
  DailyActivePauseLimitError,
  DailySatisfactionLimitError,
  InvalidVideosError,
  createActivePause,
  getVideoIdsByHashes,
  updateActivePauseSatisfactionRecord,
} from "../db/queries/activePauseQueries"
import {
  ActivePauseBlockedDayError,
  ActivePauseOutsideAllowedWindowError,
  ActivePauseWeekendError,
  ActivePauseWindowAlreadyCompletedError,
  resolveActivePauseCreationContext,
} from "../services/activePauseService"

// Convierte dos hashes de Wistia en los IDs internos de los videos.
// Se usa antes de crear la pausa activa para que el frontend no tenga que conocer IDs de base de datos.
export const resolveVideoIds = async (req: Request, res: Response) => {
  try {
    const { hashes, video_hashes } = req.body
    const finalHashes = hashes || video_hashes
    if (!Array.isArray(finalHashes) || finalHashes.length !== 2) {
      return res.status(400).json({ error: "Se requieren exactamente 2 hashes de video" })
    }

    const pool = await getPool()
    const client = await pool.connect()

    try {
      const rows = await getVideoIdsByHashes(client, finalHashes.map((hash: unknown) => String(hash).trim()))
      if (rows.length < 2) {
        return res.status(400).json({ error: "No se encontraron ambos videos" })
      }

      const ordered = finalHashes.map((hash) => rows.find((r) => r.wistia_id === hash))
      const [video1, video2] = ordered
      if (!video1 || !video2) {
        return res.status(400).json({ error: "Faltan coincidencias exactas" })
      }

      return res.json({ video1_id: video1.id, video2_id: video2.id })
    } finally {
      client.release()
    }
  } catch (err) {
    console.error("Error en resolveVideoIds:", err)
    return res.status(500).json({
      error: "Error interno resolviendo videos",
      details: err instanceof Error ? err.message : String(err),
    })
  }
}

// Registra una pausa activa para el usuario autenticado.
// El controller solo coordina validacion HTTP y delega las reglas horarias al servicio.
export const insertActivePause = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  const { video1_id, video2_id } = req.body

  if (!userId) {
    return res.status(401).json({ error: "No autenticado" })
  }

  if (!video1_id || !video2_id) {
    return res.status(400).json({ error: "Datos incompletos" })
  }

  try {
    const { dailyLimit } = await resolveActivePauseCreationContext(userId)

    const { id, reused } = await createActivePause(
      userId,
      video1_id,
      video2_id,
      dailyLimit
    )
    return res.json(reused ? { pause: { id }, reused: true } : { pause: { id } })
  } catch (error) {
    console.error("Error en insertActivePause:", error)
    if (error instanceof ActivePauseWeekendError) {
      return res.status(403).json({ error: error.message })
    }
    if (error instanceof ActivePauseBlockedDayError) {
      return res.status(403).json({ error: error.message })
    }
    if (error instanceof ActivePauseOutsideAllowedWindowError) {
      return res.status(403).json({ error: error.message })
    }
    if (error instanceof ActivePauseWindowAlreadyCompletedError) {
      return res.status(403).json({ error: error.message })
    }
    if (error instanceof DailyActivePauseLimitError) {
      return res.status(429).json({ error: error.message })
    }
    if (error instanceof InvalidVideosError) {
      return res.status(400).json({ error: error.message })
    }
    return res.status(500).json({ error: "Error al crear pausa activa" })
  }
}

// Actualiza la valoracion de una pausa ya realizada.
// Solo puede modificarla el usuario propietario de esa pausa.
export const updateActivePauseSatisfaction = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  const { id } = req.params
  const { satisfaction_level, tags, video_hash_ids } = req.body

  if (!userId) {
    return res.status(401).json({ error: "No autenticado" })
  }

  if (!id) {
    return res.status(400).json({ error: "Falta ID de la pausa activa" })
  }

  const normalizedTags = Array.isArray(tags) ? tags : []
  const videoHashes = Array.isArray(video_hash_ids)
    ? video_hash_ids.map((hash: unknown) => String(hash))
    : []

  try {
    await updateActivePauseSatisfactionRecord(id, userId, satisfaction_level, normalizedTags, videoHashes)
    return res.json({ success: true, id, satisfaction_level, tags: normalizedTags })
  } catch (error) {
    console.error("Error en updateActivePauseSatisfaction:", error)
    if (error instanceof ActivePauseNotFoundError) {
      return res.status(404).json({ error: error.message })
    }
    if (error instanceof ActivePauseForbiddenError) {
      return res.status(403).json({ error: error.message })
    }
    if (error instanceof DailySatisfactionLimitError) {
      return res.status(429).json({ error: error.message })
    }
    return res.status(500).json({ error: "Error al actualizar satisfaccion" })
  }
}
