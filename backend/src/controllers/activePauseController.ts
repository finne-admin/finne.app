import { Request, Response } from "express"
import { DateTime } from "luxon"
import { getPool } from "../config/dbManager"
import {
  ActivePauseNotFoundError,
  DailyActivePauseLimitError,
  DailySatisfactionLimitError,
  InvalidVideosError,
  createActivePause,
  getVideoIdsByHashes,
  updateActivePauseSatisfactionRecord,
} from "../db/queries/activePauseQueries"
import { listDailyActivePausesByUserId } from "../db/queries/quotaQueries"
import { getMembershipForUser, getDailyActivePauseLimitForUser } from "../db/queries/userMembershipQueries"
import { getOrganizationNotificationDefaults } from "../db/queries/notificationQueries"
import { resolveOrgTimesForDate } from "../utils/notificationTimes"

const FALLBACK_DAILY_LIMIT = Number(process.env.ACTIVE_PAUSE_DAILY_LIMIT || "3")
const DEFAULT_TIMEZONE = "Europe/Madrid"
const FALLBACK_TIMES = ["10:30", "12:00", "15:45"]
const WINDOW_BEFORE_MINUTES = 20
const WINDOW_AFTER_MINUTES = 25

const buildWindowsForDay = (times: string[], now: DateTime) => {
  const day = now.startOf("day")
  return times
    .map((time) => {
      const [hRaw, mRaw] = time.split(":")
      const hour = Number(hRaw)
      const minute = Number(mRaw)
      if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null
      const slot = day.set({ hour, minute, second: 0, millisecond: 0 })
      return {
        label: time,
        start: slot.minus({ minutes: WINDOW_BEFORE_MINUTES }),
        end: slot.plus({ minutes: WINDOW_AFTER_MINUTES }),
      }
    })
    .filter(Boolean) as { label: string; start: DateTime; end: DateTime }[]
}

// Resuelve IDs internos a partir de hashes de Wistia y responde con los dos videos solicitados.
export const resolveVideoIds = async (req: Request, res: Response) => {
  try {
    const { hashes, video_hashes } = req.body
    const finalHashes = hashes || video_hashes
    if (!Array.isArray(finalHashes) || finalHashes.length < 2) {
      return res.status(400).json({ error: "Se requieren al menos 2 hashes de video" })
    }

    const pool = await getPool()
    const client = await pool.connect()

    try {
      const rows = await getVideoIdsByHashes(client, finalHashes.map((h) => h.trim()))
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

// Crea una pausa activa evitando duplicados y respetando limites diarios.
export const insertActivePause = async (req: Request, res: Response) => {
  const { user_id, video1_id, video2_id } = req.body
  if (!user_id || !video1_id || !video2_id) {
    return res.status(400).json({ error: "Datos incompletos" })
  }

  const now = DateTime.now().setZone(DEFAULT_TIMEZONE)
  if (now.weekday === 6 || now.weekday === 7) {
    return res
      .status(403)
      .json({ error: "Las pausas activas solo estan disponibles de lunes a viernes." })
  }

  try {
    const membership = await getMembershipForUser(user_id)
    let times = [...FALLBACK_TIMES]
    if (membership?.organization_id) {
      const orgDefaults = await getOrganizationNotificationDefaults(membership.organization_id)
      if (orgDefaults) {
        times = resolveOrgTimesForDate(orgDefaults, now, times)
      }
    }
    const sortedTimes = times
      .map((value) => value.trim())
      .filter(Boolean)
      .sort()
    const dailyLimit = await getDailyActivePauseLimitForUser(user_id, FALLBACK_DAILY_LIMIT)
    const windowTimes = sortedTimes.length > dailyLimit ? sortedTimes.slice(0, dailyLimit) : sortedTimes
    const windows = buildWindowsForDay(windowTimes, now)
    const activeWindow = windows.find(
      (window) => now >= window.start && now <= window.end
    )
    if (!activeWindow) {
      return res.status(403).json({
        error: "Estas fuera del horario permitido para realizar la pausa activa.",
      })
    }

    const pausesToday = await listDailyActivePausesByUserId(user_id, DEFAULT_TIMEZONE)
    const alreadyCompleted = pausesToday.some((timestamp) => {
      const pauseTime = DateTime.fromISO(timestamp, { zone: DEFAULT_TIMEZONE })
      return pauseTime >= activeWindow.start && pauseTime <= activeWindow.end
    })
    if (alreadyCompleted) {
      return res.status(403).json({
        error: "Ya completaste la pausa correspondiente a este horario.",
      })
    }

    const { id, reused } = await createActivePause(
      user_id,
      video1_id,
      video2_id,
      dailyLimit
    )
    return res.json(reused ? { pause: { id }, reused: true } : { pause: { id } })
  } catch (error) {
    console.error("Error en insertActivePause:", error)
    if (error instanceof DailyActivePauseLimitError) {
      return res.status(429).json({ error: error.message })
    }
    if (error instanceof InvalidVideosError) {
      return res.status(400).json({ error: error.message })
    }
    return res.status(500).json({ error: "Error al crear pausa activa" })
  }
}

// Actualiza satisfaccion y etiquetas de una pausa activa y persiste la valoracion de ejercicio.
export const updateActivePauseSatisfaction = async (req: Request, res: Response) => {
  const { id } = req.params
  const { satisfaction_level, tags, video_hash_ids } = req.body
  if (!id) {
    return res.status(400).json({ error: "Falta ID de la pausa activa" })
  }

  const normalizedTags = Array.isArray(tags) ? tags : []
  const videoHashes = Array.isArray(video_hash_ids)
    ? video_hash_ids.map((hash: unknown) => String(hash))
    : []

  try {
    await updateActivePauseSatisfactionRecord(id, satisfaction_level, normalizedTags, videoHashes)
    return res.json({ success: true, id, satisfaction_level, tags: normalizedTags })
  } catch (error) {
    console.error("Error en updateActivePauseSatisfaction:", error)
    if (error instanceof ActivePauseNotFoundError) {
      return res.status(404).json({ error: error.message })
    }
    if (error instanceof DailySatisfactionLimitError) {
      return res.status(429).json({ error: error.message })
    }
    return res.status(500).json({ error: "Error al actualizar satisfaccion" })
  }
}
