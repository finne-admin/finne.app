import { PoolClient } from "pg"
import { DateTime } from "luxon"
import { uuidv7 } from "uuidv7"
import { getPool } from "../../config/dbManager"

const DAILY_SATISFACTION_LIMIT = Number(process.env.SATISFACTION_DAILY_LIMIT || "3")

const getMadridDayBounds = () => {
  const now = DateTime.now().setZone("Europe/Madrid")
  const start = now.startOf("day").toUTC()
  const end = start.plus({ days: 1 })
  return { start: start.toJSDate(), end: end.toJSDate() }
}

export class DailySatisfactionLimitError extends Error {
  constructor() {
    super("Has alcanzado el numero maximo de valoraciones hoy.")
    this.name = "DailySatisfactionLimitError"
  }
}

let hasActivePauseLinkSupport: boolean | null = null

export const exerciseSatisfactionSupportsActivePauseLink = async () => {
  if (hasActivePauseLinkSupport !== null) {
    return hasActivePauseLinkSupport
  }

  const pool = await getPool()
  const { rows } = await pool.query(
    `
    SELECT
      EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'exercise_satisfaction'
          AND column_name = 'active_pause_id'
      ) AS has_column,
      EXISTS (
        SELECT 1
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = 'public.exercise_satisfaction'::regclass
          AND i.indisunique
          AND array_length(i.indkey, 1) = 1
          AND a.attname = 'active_pause_id'
      ) AS has_unique_index
    `
  )

  const row = rows[0] || { has_column: false, has_unique_index: false }
  hasActivePauseLinkSupport = Boolean(row.has_column && row.has_unique_index)
  return hasActivePauseLinkSupport
}

/**
 * Inserta una nueva pausa activa.
 */
export const insertActivePause = async (
  client: PoolClient,
  userId: string,
  video1Id: string,
  video2Id: string
) => {
  const { rows: recent } = await client.query<{ id: string }>(
    `
    SELECT id
    FROM active_pauses
    WHERE user_id = $1
      AND created_at >= NOW() - INTERVAL '10 seconds'
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [userId]
  )

  if (recent.length > 0) {
    return recent[0].id
  }

  const { rows: existing } = await client.query<{ id: string }>(
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
    [userId, video1Id, video2Id]
  )

  if (existing.length > 0) {
    return existing[0].id
  }

  const pauseId = uuidv7()
  await client.query(
    `
    INSERT INTO active_pauses (id, user_id, video1_id, video2_id, created_at)
    VALUES ($1, $2, $3, $4, NOW())
    `,
    [pauseId, userId, video1Id, video2Id]
  )
  return pauseId
}

/**
 * Inserta nivel de satisfacción asociado a la pausa activa.
 */
export const insertExerciseSatisfaction = async (
  client: PoolClient,
  activePauseId: string,
  userId: string,
  videoIds: string[],
  satisfactionLevel: number,
  tags: string[]
) => {
  const supportsActivePauseLink = await exerciseSatisfactionSupportsActivePauseLink()

  let existingId: string | null = null
  if (supportsActivePauseLink) {
    const { rows: existingByPause } = await client.query<{ id: string }>(
      `
      SELECT id
      FROM exercise_satisfaction
      WHERE active_pause_id = $1
      FOR UPDATE
      `,
      [activePauseId]
    )
    existingId = existingByPause.length > 0 ? existingByPause[0].id : null
  }

  if (!existingId) {
    const { start, end } = getMadridDayBounds()
    const { rows } = await client.query<{ count: string }>(
      `
      SELECT COUNT(*) AS count
      FROM exercise_satisfaction
      WHERE user_id = $1
        AND created_at >= $2
        AND created_at < $3
      `,
      [userId, start, end]
    )

    const todaysCount = Number(rows[0]?.count ?? 0)
    if (todaysCount >= DAILY_SATISFACTION_LIMIT) {
      throw new DailySatisfactionLimitError()
    }
  }

  if (supportsActivePauseLink) {
    const id = existingId ?? uuidv7()
    await client.query(
      `
      INSERT INTO exercise_satisfaction (id, active_pause_id, user_id, video_hash_ids, satisfaction_level, tags, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (active_pause_id) WHERE active_pause_id IS NOT NULL DO UPDATE
      SET satisfaction_level = EXCLUDED.satisfaction_level,
          tags = EXCLUDED.tags,
          video_hash_ids = EXCLUDED.video_hash_ids
      `,
      [id, activePauseId, userId, videoIds, satisfactionLevel, tags || []]
    )
    return
  }

  const id = uuidv7()
  await client.query(
    `
    INSERT INTO exercise_satisfaction (id, user_id, video_hash_ids, satisfaction_level, tags, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    `,
    [id, userId, videoIds, satisfactionLevel, tags || []]
  )
}

/**
 * Recupera los IDs de videos a partir de sus hashes de Wistia.
 */
export const getVideoIdsByHashes = async (
  client: PoolClient,
  hashes: string[]
): Promise<{ id: string; wistia_id: string }[]> => {
  if (!hashes || hashes.length === 0) return []

  const results: { id: string; wistia_id: string }[] = []

  for (const hash of hashes) {
    try {
      const { rows } = await client.query(
        `
        SELECT id, wistia_id
        FROM videos
        WHERE wistia_id = $1
        `,
        [hash.trim()]
      )

      if (rows.length > 0) {
        results.push(rows[0])
      } else {
        console.warn(`No se encontro video con wistia_id=${hash}`)
      }
    } catch (err) {
      console.error(`Error buscando video con hash ${hash}:`, err)
    }
  }

  return results
}
