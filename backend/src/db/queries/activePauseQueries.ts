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

export class DailyActivePauseLimitError extends Error {
  constructor(limit: number) {
    super(`Has alcanzado el limite diario de ${limit} pausas activas.`)
    this.name = "DailyActivePauseLimitError"
  }
}

export class ActivePauseNotFoundError extends Error {
  constructor() {
    super("Pausa activa no encontrada")
    this.name = "ActivePauseNotFoundError"
  }
}

export class InvalidVideosError extends Error {
  constructor() {
    super("Los videos seleccionados no son validos.")
    this.name = "InvalidVideosError"
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

const countTodaysActivePauses = async (client: PoolClient, userId: string) => {
  const { start, end } = getMadridDayBounds()
  const { rows } = await client.query<{ id: string }>(
    `
    SELECT id
    FROM active_pauses
    WHERE user_id = $1
      AND created_at >= $2
      AND created_at < $3
    FOR UPDATE
    `,
    [userId, start, end]
  )

  return rows.length
}

const findRecentActivePauseId = async (client: PoolClient, userId: string) => {
  const { rows } = await client.query<{ id: string }>(
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

  return rows[0]?.id ?? null
}

const findDuplicateActivePauseId = async (
  client: PoolClient,
  userId: string,
  video1Id: string,
  video2Id: string
) => {
  const { rows } = await client.query<{ id: string }>(
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

  return rows[0]?.id ?? null
}

export const getVideosByIds = async (
  client: PoolClient,
  ids: string[]
): Promise<{ id: string; wistia_id: string | null }[]> => {
  if (!ids || ids.length === 0) return []

  const { rows } = await client.query<{ id: string; wistia_id: string | null }>(
    `
    SELECT id, wistia_id
    FROM videos
    WHERE id = ANY($1::uuid[])
    `,
    [ids]
  )

  return rows
}

const getFavoriteFlags = async (
  client: PoolClient,
  userId: string,
  wistiaMap: Map<string, string>,
  video1Id: string,
  video2Id: string
) => {
  const wistiaValues = [wistiaMap.get(video1Id) ?? "", wistiaMap.get(video2Id) ?? ""]
    .filter(Boolean)
    .map((value) => value.trim())

  if (wistiaValues.length === 0) {
    return { video1FromFavorite: false, video2FromFavorite: false }
  }

  const { rows } = await client.query<{ video_hashed_id: string }>(
    `
    SELECT video_hashed_id
    FROM exercise_favorites
    WHERE user_id = $1
      AND video_hashed_id = ANY($2)
    `,
    [userId, wistiaValues]
  )

  const favorites = new Set(rows.map((row) => row.video_hashed_id))
  return {
    video1FromFavorite: favorites.has(wistiaMap.get(video1Id) ?? ""),
    video2FromFavorite: favorites.has(wistiaMap.get(video2Id) ?? ""),
  }
}

const insertActivePauseRecord = async (
  client: PoolClient,
  userId: string,
  video1Id: string,
  video2Id: string,
  video1FromFavorite: boolean,
  video2FromFavorite: boolean
) => {
  const id = uuidv7()
  const { rows } = await client.query<{ id: string }>(
    `
    INSERT INTO active_pauses (id, user_id, video1_id, video2_id, created_at, video1_from_favorite, video2_from_favorite)
    VALUES ($1, $2, $3, $4, NOW(), $5, $6)
    RETURNING id
    `,
    [id, userId, video1Id, video2Id, video1FromFavorite, video2FromFavorite]
  )

  return rows[0]?.id ?? id
}

/**
 * Inserta una pausa activa validando limites y previniendo duplicados.
 */
export const createActivePause = async (
  userId: string,
  video1Id: string,
  video2Id: string,
  dailyLimit: number
): Promise<{ id: string; reused: boolean }> => {
  const pool = await getPool()
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const todaysCount = await countTodaysActivePauses(client, userId)
    if (todaysCount >= dailyLimit) {
      throw new DailyActivePauseLimitError(dailyLimit)
    }

    const recentId = await findRecentActivePauseId(client, userId)
    if (recentId) {
      await client.query("ROLLBACK")
      return { id: recentId, reused: true }
    }

    const duplicateId = await findDuplicateActivePauseId(client, userId, video1Id, video2Id)
    if (duplicateId) {
      await client.query("ROLLBACK")
      return { id: duplicateId, reused: true }
    }

    const videos = await getVideosByIds(client, [video1Id, video2Id])
    if (videos.length < 2) {
      throw new InvalidVideosError()
    }

    const wistiaMap = new Map(videos.map((row) => [row.id, row.wistia_id ?? ""]))
    const { video1FromFavorite, video2FromFavorite } = await getFavoriteFlags(
      client,
      userId,
      wistiaMap,
      video1Id,
      video2Id
    )

    const createdId = await insertActivePauseRecord(
      client,
      userId,
      video1Id,
      video2Id,
      video1FromFavorite,
      video2FromFavorite
    )

    await client.query("COMMIT")
    return { id: createdId, reused: false }
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

/**
 * Inserta nivel de satisfaccion asociado a la pausa activa.
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

export const updateActivePauseSatisfactionRecord = async (
  activePauseId: string,
  satisfactionLevel: unknown,
  tags: string[],
  videoHashes: string[]
) => {
  const pool = await getPool()
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const normalizedLevel = (satisfactionLevel as any) ?? null

    const result = await client.query<{ user_id: string }>(
      `
      UPDATE active_pauses
      SET satisfaction_level = $1,
          tags = $2,
          updated_at = NOW()
      WHERE id = $3
      RETURNING user_id
      `,
      [normalizedLevel, tags, activePauseId]
    )

    if (result.rowCount === 0) {
      throw new ActivePauseNotFoundError()
    }

    const { user_id: userId } = result.rows[0]

    if (typeof satisfactionLevel === "number" && Number.isFinite(satisfactionLevel)) {
      await insertExerciseSatisfaction(
        client,
        activePauseId,
        userId,
        videoHashes,
        satisfactionLevel,
        tags
      )
    }

    await client.query("COMMIT")
    return { userId }
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
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
