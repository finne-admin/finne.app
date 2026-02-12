import { PoolClient } from "pg"
import { getPool } from "../../config/dbManager"

export type TimestampRow = { created_at: string }

export type UnlockedAchievementRow = {
  id: string
  title: string
  description: string
  icon: string
}

export type AchievementStatusRow = {
  id: string
  title: string
  description: string
  icon: string
  category: string | null
  points: number
  completado: boolean
  reclamado: boolean
  group_id: string | null
  level: number | null
}

export type WeeklyChallengeCatalogRow = {
  id: string
  title: string
  description: string
  points: number | null
  condition_type: string
  goal: number | null
}

export type WeeklyChallengeProgressRow = {
  challenge_id: string
  progreso_actual: number | null
  progreso_total: number | null
  completado: boolean | null
  reclamado: boolean | null
}

export type RankingRow = {
  id: string
  first_name: string
  last_name: string
  avatar_url: string | null
  periodical_exp: number
}

export type RankingMatchRow = RankingRow & {
  rank: number
}

export type RankingPositionRow = {
  total_users: number
  rank: number
}

export type RankingFilter = {
  organizationId?: string | null
  departmentId?: string | null
}

export type AchievementInfo = {
  title: string | null
  icon: string | null
}

export type CalcTotalsResult = {
  dept_target_75: number | null
  dept_total_ap: number | null
  per_user_total: number | null
}

export const getUserBasics = async (userId: string) => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `
    SELECT id, email, first_name, last_name, avatar_url, COALESCE(exp, 0) AS exp
    FROM users
    WHERE id = $1
    `,
    [userId]
  )
  return rows[0] || null
}

export const countCompletedAchievements = async (userId: string) => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `
    SELECT COUNT(*)::int AS total
    FROM user_achievements
    WHERE user_id = $1 AND completado = true
    `,
    [userId]
  )
  return rows[0]?.total ?? 0
}

export const getActivePausesSince = async (userId: string, sinceISO: string): Promise<TimestampRow[]> => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `
    SELECT created_at
    FROM active_pauses
    WHERE user_id = $1 AND created_at >= $2
    ORDER BY created_at DESC
    `,
    [userId, sinceISO]
  )
  return rows as TimestampRow[]
}

export const getWeeklyActivityPauses = async (userId: string): Promise<TimestampRow[]> => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `
    SELECT created_at
    FROM active_pauses
    WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '10 days'
    ORDER BY created_at DESC
    `,
    [userId]
  )
  return rows as TimestampRow[]
}

export const getUnlockedAchievements = async (userId: string): Promise<UnlockedAchievementRow[]> => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `
    SELECT c.id, c.title, c.description, c.icon
    FROM user_achievements ua
    JOIN achievements_catalog c ON c.id = ua.achievement_id
    WHERE ua.user_id = $1 AND ua.completado = true
    ORDER BY ua.unlocked_at DESC NULLS LAST
    LIMIT 50
    `,
    [userId]
  )
  return rows as UnlockedAchievementRow[]
}

export const getAchievementsCatalogWithStatus = async (userId: string): Promise<AchievementStatusRow[]> => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `
    SELECT
      c.id,
      c.title,
      c.description,
      c.icon,
      c.category,
      COALESCE(c.points, 0) AS points,
      COALESCE(ua.completado, false) AS completado,
      COALESCE(ua.reclamado, false) AS reclamado,
      c.group_id,
      c.level
    FROM achievements_catalog c
    LEFT JOIN user_achievements ua
      ON ua.achievement_id = c.id
     AND ua.user_id = $1
    ORDER BY COALESCE(c.group_id::text, c.id::text), COALESCE(c.level, 999), c.title ASC
    `,
    [userId]
  )
  return rows as AchievementStatusRow[]
}

export const getWeeklyChallengesCatalog = async (): Promise<WeeklyChallengeCatalogRow[]> => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `
    SELECT id, title, description, points, condition_type, goal
    FROM weekly_challenges_catalog
    `
  )
  return rows as WeeklyChallengeCatalogRow[]
}

export const getUserWeeklyChallenges = async (
  userId: string,
  weekId: string
): Promise<WeeklyChallengeProgressRow[]> => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `
    SELECT challenge_id, progreso_actual, progreso_total, completado, reclamado
    FROM user_weekly_challenges
    WHERE user_id = $1 AND week_id = $2
    `,
    [userId, weekId]
  )
  return rows as WeeklyChallengeProgressRow[]
}

export const claimAchievementRow = async (
  client: PoolClient,
  userId: string,
  achievementId: string
) => {
  const { rows } = await client.query(
    `
    UPDATE user_achievements
    SET reclamado = true
    WHERE user_id = $1
      AND achievement_id = $2
      AND completado = true
      AND (reclamado = false OR reclamado IS NULL)
    RETURNING achievement_id
    `,
    [userId, achievementId]
  )
  return (rows[0] as WeeklyChallengeProgressRow) || null
}

export const claimWeeklyChallengeRow = async (
  client: PoolClient,
  userId: string,
  challengeId: string,
  weekId: string
) => {
  const { rows } = await client.query(
    `
    UPDATE user_weekly_challenges
    SET reclamado = true
    WHERE user_id = $1
      AND challenge_id = $2
      AND week_id = $3
      AND completado = true
      AND (reclamado = false OR reclamado IS NULL)
    RETURNING challenge_id, progreso_actual, progreso_total, completado, reclamado
    `,
    [userId, challengeId, weekId]
  )
  return rows[0] || null
}

export const incrementWeeklyChallengeProgress = async (
  userId: string,
  weekId: string,
  challengeId: string,
  increment: number,
  goal: number
) => {
  const normalizedGoal = Math.max(0, Math.floor(Number(goal) || 0))
  const normalizedIncrement = Math.max(0, Math.floor(Number(increment) || 0))

  if (!normalizedGoal || !normalizedIncrement) {
    return null
  }

  const pool = await getPool()

  const { rows } = await pool.query<WeeklyChallengeProgressRow>(
    `
    INSERT INTO user_weekly_challenges (
      user_id,
      week_id,
      challenge_id,
      progreso_actual,
      progreso_total,
      completado,
      reclamado
    )
    VALUES (
      $1,
      $2,
      $3,
      LEAST($5::int, $4::int),
      $5::int,
      LEAST($5::int, $4::int) >= $5::int,
      false
    )
    ON CONFLICT (user_id, week_id, challenge_id)
    DO UPDATE SET
      progreso_actual = LEAST(
        user_weekly_challenges.progreso_total,
        user_weekly_challenges.progreso_actual + EXCLUDED.progreso_actual
      ),
      completado = LEAST(
        user_weekly_challenges.progreso_total,
        user_weekly_challenges.progreso_actual + EXCLUDED.progreso_actual
      ) >= user_weekly_challenges.progreso_total
    RETURNING challenge_id, progreso_actual, progreso_total, completado, reclamado
    `,
    [userId, weekId, challengeId, normalizedIncrement, normalizedGoal]
  )

  return rows[0] || null
}

export const getAchievementPoints = async (achievementId: string) => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `SELECT COALESCE(points, 0) AS points FROM achievements_catalog WHERE id = $1`,
    [achievementId]
  )
  return rows[0]?.points ?? 0
}

export const getWeeklyChallengeDefinition = async (
  challengeId: string
): Promise<WeeklyChallengeCatalogRow | null> => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `SELECT id, title, description, points, condition_type, goal FROM weekly_challenges_catalog WHERE id = $1`,
    [challengeId]
  )
  return (rows[0] as WeeklyChallengeCatalogRow) || null
}

export const getUnclaimedCounts = async (
  userId: string
): Promise<{ achievements: number; weekly: number }> => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `
    SELECT
      (SELECT COUNT(*)::int
       FROM user_achievements
       WHERE user_id = $1 AND completado = true AND (reclamado = false OR reclamado IS NULL)
      ) AS achievements,
      (SELECT COUNT(*)::int
       FROM user_weekly_challenges
       WHERE user_id = $1 AND completado = true AND (reclamado = false OR reclamado IS NULL)
      ) AS weekly
    `,
    [userId]
  )
  return rows[0] || { achievements: 0, weekly: 0 }
}

export const getDepartmentTotalExp = async () => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `SELECT COALESCE(SUM(periodical_exp), 0) AS total FROM users`
  )
  return Number(rows[0]?.total ?? 0)
}

const buildRankingFilterClause = (filters?: RankingFilter) => {
  const params: any[] = []
  const conditions: string[] = []

  if (filters?.organizationId) {
    params.push(filters.organizationId)
    conditions.push(`um.organization_id = $${params.length}`)
  }

  if (filters?.departmentId) {
    params.push(filters.departmentId)
    conditions.push(`um.department_id = $${params.length}`)
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""
  return { whereClause, params }
}

export const getRankingTop = async (limit = 10, filters?: RankingFilter): Promise<RankingRow[]> => {
  const pool = await getPool()
  const { whereClause, params } = buildRankingFilterClause(filters)
  params.push(limit)

  const { rows } = await pool.query(
    `
    SELECT u.id, u.first_name, u.last_name, u.avatar_url, COALESCE(u.periodical_exp, 0) AS periodical_exp
    FROM users u
    LEFT JOIN user_membership um ON um.user_id = u.id
    ${whereClause}
    ORDER BY COALESCE(u.periodical_exp, 0) DESC, u.first_name ASC
    LIMIT $${params.length}
    `,
    params
  )
  return rows as RankingRow[]
}

export const getRankingPage = async (
  limit = 10,
  offset = 0,
  filters?: RankingFilter
): Promise<RankingRow[]> => {
  const pool = await getPool()
  const { whereClause, params } = buildRankingFilterClause(filters)
  params.push(limit)
  params.push(offset)

  const { rows } = await pool.query(
    `
    SELECT u.id, u.first_name, u.last_name, u.avatar_url, COALESCE(u.periodical_exp, 0) AS periodical_exp
    FROM users u
    LEFT JOIN user_membership um ON um.user_id = u.id
    ${whereClause}
    ORDER BY COALESCE(u.periodical_exp, 0) DESC, u.first_name ASC
    LIMIT $${params.length - 1}
    OFFSET $${params.length}
    `,
    params
  )
  return rows as RankingRow[]
}

export const searchRankingUsers = async (
  query: string,
  limit = 5,
  filters?: RankingFilter
): Promise<RankingMatchRow[]> => {
  const pool = await getPool()
  const { whereClause, params } = buildRankingFilterClause(filters)
  const searchParam = `${query}%`
  params.push(searchParam)
  params.push(limit)

  const { rows } = await pool.query(
    `
    WITH filtered AS (
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.avatar_url,
        COALESCE(u.periodical_exp, 0) AS periodical_exp
      FROM users u
      LEFT JOIN user_membership um ON um.user_id = u.id
      ${whereClause}
    ),
    ranked AS (
      SELECT
        *,
        RANK() OVER (ORDER BY periodical_exp DESC) AS rank
      FROM filtered
    )
    SELECT id, first_name, last_name, avatar_url, periodical_exp, rank
    FROM ranked
    WHERE (first_name || ' ' || last_name) ILIKE $${params.length - 1}
       OR first_name ILIKE $${params.length - 1}
       OR last_name ILIKE $${params.length - 1}
    ORDER BY rank ASC
    LIMIT $${params.length}
    `,
    params
  )

  return rows as RankingMatchRow[]
}

export const getUserPeriodicalExp = async (userId: string): Promise<number> => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `SELECT COALESCE(periodical_exp, 0) AS periodical_exp FROM users WHERE id = $1`,
    [userId]
  )
  return Number(rows[0]?.periodical_exp ?? 0)
}

export const getUserRankingPosition = async (
  userId: string,
  filters?: RankingFilter
): Promise<RankingPositionRow | null> => {
  const pool = await getPool()
  const { whereClause, params } = buildRankingFilterClause(filters)
  const userParamIndex = params.length + 1

  const { rows } = await pool.query(
    `
    WITH filtered AS (
      SELECT u.id, COALESCE(u.periodical_exp, 0) AS periodical_exp
      FROM users u
      LEFT JOIN user_membership um ON um.user_id = u.id
      ${whereClause}
    ),
    ranked AS (
      SELECT
        id,
        periodical_exp,
        RANK() OVER (ORDER BY periodical_exp DESC) AS rank
      FROM filtered
    ),
    totals AS (
      SELECT COUNT(*) AS total_users FROM filtered
    )
    SELECT
      totals.total_users,
      (SELECT rank FROM ranked WHERE id = $${userParamIndex}) AS rank
    FROM totals
    `,
    [...params, userId]
  )
  return (rows[0] as RankingPositionRow) || null
}

export const countActiveParticipants = async (startISO: string, endISO: string) => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `
    SELECT COUNT(DISTINCT user_id)::int AS total
    FROM active_pauses
    WHERE created_at >= $1 AND created_at <= $2
    `,
    [startISO, endISO]
  )
  return rows[0]?.total ?? 0
}

const parseCategoryArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map((v) => String(v))
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      return trimmed
        .slice(1, -1)
        .split(",")
        .map((item) => item.replace(/(^"|"$)/g, "").trim())
        .filter(Boolean)
    }
    return trimmed ? [trimmed] : []
  }
  return []
}

export const getVideoCategoriesSet = async (ids: string[]): Promise<Set<string>> => {
  if (!ids.length) return new Set()
  const pool = await getPool()
  const { rows } = await pool.query<{ id: string; categorias: unknown }>(
    `SELECT id, categorias FROM videos WHERE id = ANY($1::uuid[])`,
    [ids]
  )
  const categories = new Set<string>()
  for (const row of rows) {
    parseCategoryArray(row.categorias).forEach((cat) => categories.add(cat.toLowerCase()))
  }
  return categories
}

export const getAchievementInfo = async (
  achievementId: string,
  client?: PoolClient
): Promise<AchievementInfo | null> => {
  const db = client ?? (await getPool())
  const { rows } = await db.query(
    `SELECT title, icon FROM achievements_catalog WHERE id = $1`,
    [achievementId]
  )
  if (!rows[0]) return null
  return { title: rows[0].title ?? null, icon: rows[0].icon ?? null }
}

export const calculateActivePauseTotals = async (
  startISO: string,
  endISO: string,
  usersCount: number,
  includeOneShots: boolean,
  onlyBusinessDays: boolean
): Promise<CalcTotalsResult | null> => {
  const pool = await getPool()
  const { rows } = await pool.query<CalcTotalsResult>(
    `
    SELECT *
    FROM calc_ap_totals(
      p_start := $1,
      p_end := $2,
      p_users := $3,
      p_include_one_shots := $4,
      p_only_business_days := $5
    )
    `,
    [startISO, endISO, usersCount, includeOneShots, onlyBusinessDays]
  )
  return rows[0] ?? null
}
