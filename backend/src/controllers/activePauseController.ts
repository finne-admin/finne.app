import { Request, Response } from "express"
import { DateTime } from "luxon"
import { getPool } from "../config/dbManager"
import {
  DailySatisfactionLimitError,
  getVideoIdsByHashes,
  insertExerciseSatisfaction,
} from "../db/queries/activePauseQueries"
import { uuidv7 } from "uuidv7"

const DAILY_ACTIVE_PAUSE_LIMIT = Number(process.env.ACTIVE_PAUSE_DAILY_LIMIT || "3")

const getMadridDayBounds = () => {
  const now = DateTime.now().setZone("Europe/Madrid")
  const start = now.startOf("day").toUTC()
  const end = start.plus({ days: 1 })
  return { start: start.toJSDate(), end: end.toJSDate() }
}

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

export const insertActivePause = async (req: Request, res: Response) => {
  const { user_id, video1_id, video2_id } = req.body
  if (!user_id || !video1_id || !video2_id) {
    return res.status(400).json({ error: "Datos incompletos" })
  }

  const now = DateTime.now().setZone("Europe/Madrid")
  if (now.weekday === 6 || now.weekday === 7) {
    return res
      .status(403)
      .json({ error: "Las pausas activas solo estan disponibles de lunes a viernes." })
  }

  const pool = await getPool()
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const { start, end } = getMadridDayBounds()
    const todaysPauses = await client.query<{ id: string }>(
      `
      SELECT id
      FROM active_pauses
      WHERE user_id = $1
        AND created_at >= $2
        AND created_at < $3
      FOR UPDATE
      `,
      [user_id, start, end]
    )

    const todaysCount = todaysPauses.rows.length
    if (todaysCount >= DAILY_ACTIVE_PAUSE_LIMIT) {
      await client.query("ROLLBACK")
      return res
        .status(429)
        .json({ error: "Has alcanzado el limite diario de 3 pausas activas." })
    }

    const recentPause = await client.query<{ id: string }>(
      `
      SELECT id
      FROM active_pauses
      WHERE user_id = $1
        AND created_at >= NOW() - INTERVAL '10 seconds'
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [user_id]
    )
    if (recentPause.rows.length > 0) {
      await client.query("ROLLBACK")
      return res.json({ pause: { id: recentPause.rows[0].id }, reused: true })
    }

    const duplicateCombination = await client.query<{ id: string }>(
      `
      SELECT id
      FROM active_pauses
      WHERE user_id = $1
        AND (
          (video1_id = $2 AND video2_id = $3) OR
          (video1_id = $3 AND video2_id = $2)
        )
        AND created_at >= NOW() - INTERVAL '30 seconds'
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [user_id, video1_id, video2_id]
    )
    if (duplicateCombination.rows.length > 0) {
      await client.query("ROLLBACK")
      return res.json({ pause: { id: duplicateCombination.rows[0].id }, reused: true })
    }

    const { rows: videoRows } = await client.query<{ id: string; wistia_id: string | null }>(
      `SELECT id, wistia_id FROM videos WHERE id = ANY($1::uuid[])`,
      [[video1_id, video2_id]]
    )
    if (videoRows.length < 2) {
      await client.query("ROLLBACK")
      return res.status(400).json({ error: "Los videos seleccionados no son validos." })
    }

    const wistiaMap = new Map(videoRows.map((row) => [row.id, row.wistia_id ?? ""]))
    const wistiaValues = [wistiaMap.get(video1_id) ?? "", wistiaMap.get(video2_id) ?? ""].filter(Boolean)

    let video1FromFavorite = false
    let video2FromFavorite = false

    if (wistiaValues.length > 0) {
      const { rows: favRows } = await client.query<{ video_hashed_id: string }>(
        `
        SELECT video_hashed_id
        FROM exercise_favorites
        WHERE user_id = $1
          AND video_hashed_id = ANY($2)
        `,
        [user_id, wistiaValues]
      )
      const favSet = new Set(favRows.map((row) => row.video_hashed_id))
      video1FromFavorite = favSet.has(wistiaMap.get(video1_id) ?? "")
      video2FromFavorite = favSet.has(wistiaMap.get(video2_id) ?? "")
    }

    const id = uuidv7()
    const { rows } = await client.query(
      `INSERT INTO active_pauses (id, user_id, video1_id, video2_id, created_at, video1_from_favorite, video2_from_favorite)
       VALUES ($1, $2, $3, $4, NOW(), $5, $6)
       RETURNING id`,
      [id, user_id, video1_id, video2_id, video1FromFavorite, video2FromFavorite]
    )

    await client.query("COMMIT")
    return res.json({ pause: { id: rows[0].id } })
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error en insertActivePause:", error)
    return res.status(500).json({ error: "Error al crear pausa activa" })
  } finally {
    client.release()
  }
}

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

  const pool = await getPool()
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const result = await client.query(
      `
      UPDATE active_pauses
      SET satisfaction_level = $1,
          tags = $2,
          updated_at = NOW()
      WHERE id = $3
      RETURNING user_id
      `,
      [satisfaction_level ?? null, normalizedTags, id]
    )

    if (result.rowCount === 0) {
      await client.query("ROLLBACK")
      return res.status(404).json({ error: "Pausa activa no encontrada" })
    }

    const { user_id } = result.rows[0]

    if (typeof satisfaction_level === "number" && Number.isFinite(satisfaction_level)) {
      await insertExerciseSatisfaction(
        client,
        id,
        user_id,
        videoHashes,
        satisfaction_level,
        normalizedTags
      )
    }

    await client.query("COMMIT")
    return res.json({ success: true, id, satisfaction_level, tags: normalizedTags })
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error en updateActivePauseSatisfaction:", error)
    if (error instanceof DailySatisfactionLimitError) {
      return res.status(429).json({ error: error.message })
    }
    return res.status(500).json({ error: "Error al actualizar satisfaccion" })
  } finally {
    client.release()
  }
}
