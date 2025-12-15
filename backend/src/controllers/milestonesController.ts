import { Request, Response } from "express"
import { getPool } from "../config/dbManager"
import {
  getUserBasics,
  countCompletedAchievements,
  getActivePausesSince,
  getWeeklyActivityPauses,
  getUnlockedAchievements,
  getAchievementsCatalogWithStatus,
  getWeeklyChallengesCatalog,
  getUserWeeklyChallenges,
  claimAchievementRow,
  getAchievementPoints,
  getWeeklyChallengeDefinition,
  claimWeeklyChallengeRow,
  incrementWeeklyChallengeProgress,
  getUnclaimedCounts,
  getDepartmentTotalExp,
  getRankingTop,
  getUserRankingPosition,
  countActiveParticipants,
  RankingFilter,
} from "../db/queries/milestonesQueries"
import { getMembershipForUser } from "../db/queries/userMembershipQueries"
import { calculateWorkdayStreak } from "../utils/streak"
import { getZonedDateInfo, nextCalendarDay, shiftDateByDays } from "../utils/timezone"
import { addUserXP } from "../db/queries/xpQueries"
import { getAchievementsProgress } from "../services/achievementService"
import { resolveRewardsForScope } from "../services/rewardService"

const TIMEZONE = "Europe/Madrid"
const SUPPORTED_WEEKLY_TYPES = new Set([
  "pausas_semana",
  "ejercicios_brazos",
  "ejercicios_piernas",
  "ejercicios_core",
  "ejercicios_movilidad",
])

const getCurrentWeekDates = () => {
  const now = new Date()
  let cursor = new Date(now.getTime())
  let info = getZonedDateInfo(cursor, TIMEZONE)
  while (info.weekday !== 1) {
    cursor = shiftDateByDays(cursor, -1)
    info = getZonedDateInfo(cursor, TIMEZONE)
  }

  const dates: string[] = []
  let iter = new Date(cursor.getTime())
  for (let i = 0; i < 5; i++) {
    const dayInfo = getZonedDateInfo(iter, TIMEZONE)
    dates.push(dayInfo.isoDate)
    iter = nextCalendarDay(iter)
  }
  return dates
}

const getWeekIdMadrid = () => getCurrentWeekDates()[0]

const seededShuffle = <T,>(items: T[], seed: string): T[] => {
  let x = 0
  for (let i = 0; i < seed.length; i++) {
    x = (x ^ seed.charCodeAt(i)) >>> 0
    x = (x + ((x << 7) | 0)) >>> 0
  }
  if (x === 0) x = 1337

  const rnd = () => {
    x ^= x << 13
    x >>>= 0
    x ^= x >>> 17
    x >>>= 0
    x ^= x << 5
    x >>>= 0
    return (x >>> 0) / 0xffffffff
  }

  const arr = items.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const fetchScopeNames = async (organizationId?: string | null, departmentId?: string | null) => {
  let organizationName: string | null = null
  let departmentName: string | null = null
  if (!organizationId && !departmentId) {
    return { organizationName, departmentName }
  }

  const pool = await getPool()
  if (organizationId) {
    const org = await pool.query<{ name: string }>(`SELECT name FROM organizations WHERE id = $1`, [organizationId])
    organizationName = org.rows[0]?.name ?? null
  }
  if (departmentId) {
    const dept = await pool.query<{ name: string }>(`SELECT name FROM departments WHERE id = $1`, [departmentId])
    departmentName = dept.rows[0]?.name ?? null
  }
  return { organizationName, departmentName }
}

export const getMilestonesSummary = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: "No autenticado" })

  try {
    const [basics, achievementsTotal, pauses] = await Promise.all([
      getUserBasics(userId),
      countCompletedAchievements(userId),
      getActivePausesSince(userId, new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()),
    ])

    if (!basics) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    const createdAtList = pauses.map((row) => row.created_at)
    const streak = calculateWorkdayStreak(createdAtList, TIMEZONE)

    return res.json({
      firstName: basics.first_name,
      lastName: basics.last_name,
      email: basics.email,
      avatarUrl: basics.avatar_url,
      exp: Number(basics.exp ?? 0),
      achievements: achievementsTotal,
      streak,
      celebrate: false,
      streakJustHit: null,
    })
  } catch (error) {
    console.error("Error en getMilestonesSummary:", error)
    return res.status(500).json({ error: "Error al obtener resumen" })
  }
}

export const getWeeklyActivity = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: "No autenticado" })

  try {
    const pauses = await getWeeklyActivityPauses(userId)
    const pauseDates = new Set(
      pauses.map((row) => getZonedDateInfo(new Date(row.created_at), TIMEZONE).isoDate)
    )
    const weekDates = getCurrentWeekDates()
    const days = weekDates.map((iso) => pauseDates.has(iso))
    return res.json({
      days,
      activeDays: days.filter(Boolean).length,
    })
  } catch (error) {
    console.error("Error en getWeeklyActivity:", error)
    return res.status(500).json({ error: "Error al obtener actividad semanal" })
  }
}

export const getUnlockedAchievementsController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: "No autenticado" })

  try {
    const data = await getUnlockedAchievements(userId)
    const formatted = data.map((row) => ({
      id: row.id,
      titulo: row.title,
      descripcion: row.description,
      icono: row.icon,
    }))
    return res.json({ achievements: formatted })
  } catch (error) {
    console.error("Error en getUnlockedAchievements:", error)
    return res.status(500).json({ error: "Error al obtener logros" })
  }
}

export const getAllAchievementsController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: "No autenticado" })

  try {
    const data = await getAchievementsCatalogWithStatus(userId)
    const progressMap = await getAchievementsProgress(userId)
    const formatted = data.map((row) => ({
      id: row.id,
      titulo: row.title,
      descripcion: row.description,
      icono: row.icon,
      category: row.category,
      puntos: row.points ?? 0,
      completado: row.completado,
      reclamado: row.reclamado,
      groupId: row.group_id,
      level: row.level,
      progresoActual: progressMap.get(row.id)?.current ?? 0,
      progresoTotal: progressMap.get(row.id)?.total ?? (Number(row.points ?? 0) || 1),
    }))
    return res.json({ achievements: formatted })
  } catch (error) {
    console.error("Error en getAllAchievements:", error)
    return res.status(500).json({ error: "Error al obtener católogo de logros" })
  }
}

export const claimAchievementController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  const achievementId = req.params.id
  if (!userId) return res.status(401).json({ error: "No autenticado" })
  if (!achievementId) return res.status(400).json({ error: "Falta achievementId" })

  const pool = await getPool()
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    const row = await claimAchievementRow(client, userId, achievementId)
    if (!row) {
      await client.query("ROLLBACK")
      return res.status(400).json({ error: "El logro no está disponible para reclamar" })
    }

    const [points, achievementInfo] = await Promise.all([
      getAchievementPoints(achievementId),
      client
        .query(`SELECT title, icon FROM achievements_catalog WHERE id = $1`, [achievementId])
        .then((res) => res.rows[0])
        .catch(() => null),
    ])

    await client.query("COMMIT")
    if (points > 0) {
      try {
        await addUserXP(userId, points, {
          source: "achievement",
          achievementId,
          achievement_title: achievementInfo?.title ?? null,
          achievement_icon: achievementInfo?.icon ?? null,
        })
      } catch (error) {
        console.error("Error añadiendo XP tras reclamar logro:", error)
      }
    }
    return res.json({ success: true, points })
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error en claimAchievementController:", error)
    return res.status(500).json({ error: "Error al reclamar logro" })
  } finally {
    client.release()
  }
}

export const getWeeklyChallengesController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: "No autenticado" })

  try {
    const catalog = await getWeeklyChallengesCatalog()
    const filtered = catalog.filter((item) => SUPPORTED_WEEKLY_TYPES.has(item.condition_type))
    const weekId = getWeekIdMadrid()
    const selected = seededShuffle(filtered, weekId).slice(0, 5)
    const progressRows = await getUserWeeklyChallenges(userId, weekId)
    const progressMap = new Map(progressRows.map((row) => [row.challenge_id, row]))

    const challenges = selected.map((item) => {
      const progress = progressMap.get(item.id)
      return {
        id: item.id,
        titulo: item.title,
        descripcion: item.description,
        puntos: item.points ?? 0,
        progresoActual: progress?.progreso_actual ?? 0,
        progresoTotal: progress?.progreso_total ?? item.goal ?? 1,
        completado: progress?.completado ?? false,
        reclamado: progress?.reclamado ?? false,
      }
    })

    return res.json({ weekId, challenges })
  } catch (error) {
    console.error("Error en getWeeklyChallengesController:", error)
    return res.status(500).json({ error: "Error al obtener retos semanales" })
  }
}

export const getWeeklyChallengesCatalogController = async (_req: Request, res: Response) => {
  try {
    const catalog = await getWeeklyChallengesCatalog()
    const filtered = catalog.filter((item) => SUPPORTED_WEEKLY_TYPES.has(item.condition_type))
    return res.json({ challenges: filtered })
  } catch (error) {
    console.error("Error en getWeeklyChallengesCatalogController:", error)
    return res.status(500).json({ error: "Error al obtener catálogo de retos" })
  }
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

const getVideoCategories = async (ids: string[]): Promise<Set<string>> => {
  if (!ids.length) return new Set()
  const pool = await getPool()
  const { rows } = await pool.query<{ id: string; categorias: any }>(
    `SELECT id, categorias FROM videos WHERE id = ANY($1::uuid[])`,
    [ids]
  )
  const categories = new Set<string>()
  for (const row of rows) {
    parseCategoryArray(row.categorias).forEach((cat) => categories.add(cat.toLowerCase()))
  }
  return categories
}

export const postWeeklyChallengeProgressController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: "No autenticado" })

  const eventType = typeof req.body?.event === "string" ? req.body.event : "active_pause_inserted"
  if (eventType !== "active_pause_inserted") {
    return res.json({ updated: 0 })
  }

  try {
    const catalog = await getWeeklyChallengesCatalog()
    const filtered = catalog.filter((item) => SUPPORTED_WEEKLY_TYPES.has(item.condition_type))
    if (!filtered.length) return res.json({ updated: 0 })

    const weekId = getWeekIdMadrid()
    const payload = req.body?.payload ?? {}
    const videoIds = [payload?.video1_id, payload?.video2_id]
      .filter((id: unknown): id is string => typeof id === "string" && id.length > 0)

    const categories = await getVideoCategories(videoIds)
    const lowercaseCategories = new Set(Array.from(categories))

    const increments: { challengeId: string; inc: number; goal: number }[] = []
    const addIncrement = (type: string, amount: number) => {
      filtered
        .filter((challenge) => challenge.condition_type === type)
        .forEach((challenge) => {
          const goal = Number(challenge.goal ?? 0)
          if (goal > 0) {
            increments.push({ challengeId: challenge.id, inc: amount, goal })
          }
        })
    }

    addIncrement("pausas_semana", 1)

    if (lowercaseCategories.has("miembro superior")) addIncrement("ejercicios_brazos", 1)
    if (lowercaseCategories.has("miembro inferior")) addIncrement("ejercicios_piernas", 1)
    if (lowercaseCategories.has("core")) addIncrement("ejercicios_core", 1)
    if (lowercaseCategories.has("movilidad")) addIncrement("ejercicios_movilidad", 1)

    if (!increments.length) return res.json({ updated: 0 })

    const results = await Promise.all(
      increments.map((entry) =>
        incrementWeeklyChallengeProgress(userId, weekId, entry.challengeId, entry.inc, entry.goal)
      )
    )

    const applied = results.filter(Boolean)
    return res.json({ updated: applied.length })
  } catch (error) {
    console.error("Error en postWeeklyChallengeProgressController:", error)
    return res.status(500).json({ error: "Error al actualizar progreso semanal" })
  }
}

export const claimWeeklyChallengeController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  const challengeId = req.params.id
  if (!userId) return res.status(401).json({ error: "No autenticado" })
  if (!challengeId) return res.status(400).json({ error: "Falta challengeId" })

  const weekId = getWeekIdMadrid()
  const pool = await getPool()
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    const result = await claimWeeklyChallengeRow(client, userId, challengeId, weekId)
    if (!result) {
      await client.query("ROLLBACK")
      return res.status(400).json({ error: "El reto no está disponible para reclamar" })
    }

    const definition = await getWeeklyChallengeDefinition(challengeId)
    const points = definition?.points ?? 0
    await client.query("COMMIT")
    if (points > 0) {
      try {
        await addUserXP(userId, points, {
          source: "weekly_challenge",
          challengeId,
          challenge_title: definition?.title ?? null,
        })
      } catch (error) {
        console.error("Error añadiendo XP tras reclamar reto semanal:", error)
      }
    }
    return res.json({ success: true, points })
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error en claimWeeklyChallengeController:", error)
    return res.status(500).json({ error: "Error al reclamar reto semanal" })
  } finally {
    client.release()
  }
}

export const getUnclaimedCountsController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: "No autenticado" })

  try {
    const counts = await getUnclaimedCounts(userId)
    return res.json(counts)
  } catch (error) {
    console.error("Error en getUnclaimedCountsController:", error)
    return res.status(500).json({ error: "Error al obtener contadores" })
  }
}

export const getDepartmentProgressController = async (_req: Request, res: Response) => {
  try {
    const total = await getDepartmentTotalExp()
    return res.json({ total })
  } catch (error) {
    console.error("Error en getDepartmentProgressController:", error)
    return res.status(500).json({ error: "Error al obtener progreso del departamento" })
  }
}

export const getRankingController = async (req: Request, res: Response) => {
  const user = (req as any).user
  const userId = user?.id
  if (!userId) return res.status(401).json({ error: "No autenticado" })

  const roleName = user?.roleName?.toLowerCase()
  const roleScope = user?.roleScope
  const isSuperAdmin = roleName === "superadmin" || roleScope === "global"

  let filters: RankingFilter | undefined
  let membershipInfo: any = null
  let scopeInfo: any = { mode: "global" as const }

  const normalizeScopeId = (value?: string) => {
    if (!value) return undefined
    const trimmed = value.trim().toLowerCase()
    if (!trimmed.length || trimmed === "all" || trimmed === "global") {
      return undefined
    }
    return value.trim()
  }

  try {
    if (isSuperAdmin) {
      const scopeParamRaw =
        typeof req.query.scope === "string" ? req.query.scope.toLowerCase() : undefined
      const requestedOrg =
        typeof req.query.organizationId === "string"
          ? normalizeScopeId(req.query.organizationId)
          : undefined
      const requestedDept =
        typeof req.query.departmentId === "string"
          ? normalizeScopeId(req.query.departmentId)
          : undefined

      if (requestedDept && !requestedOrg) {
        return res
          .status(400)
          .json({ error: "Debes indicar una organizacion valida para filtrar por departamento" })
      }

      const hasExplicitFilter = Boolean(requestedOrg || requestedDept)
      const useGlobalScope =
        scopeParamRaw === "global" || (!scopeParamRaw && !hasExplicitFilter)

      if (!useGlobalScope) {
        if (!requestedOrg) {
          return res
            .status(400)
            .json({ error: "Debes indicar una organizacion para ver su ranking" })
        }
        filters = { organizationId: requestedOrg, departmentId: requestedDept }
        const { organizationName, departmentName } = await fetchScopeNames(
          requestedOrg,
          requestedDept
        )
        scopeInfo = {
          mode: requestedDept ? "department" : "organization",
          organizationId: requestedOrg,
          organizationName,
          departmentId: requestedDept ?? null,
          departmentName,
        }
      } else {
        scopeInfo = { mode: "global" }
      }
    } else {
      const membership = await getMembershipForUser(userId)
      if (!membership?.organization_id || !membership?.department_id) {
        return res
          .status(400)
          .json({ error: "Tu cuenta no esta asociada a una organizacion y departamento" })
      }
      filters = {
        organizationId: membership.organization_id,
        departmentId: membership.department_id,
      }
      membershipInfo = {
        organizationId: membership.organization_id,
        organizationName: membership.organization_name,
        departmentId: membership.department_id,
        departmentName: membership.department_name,
      }
      scopeInfo = {
        mode: "department",
        ...membershipInfo,
      }
    }

    const [top, position, rewards] = await Promise.all([
      getRankingTop(10, filters),
      getUserRankingPosition(userId, filters),
      resolveRewardsForScope(scopeInfo as any),
    ])

    return res.json({
      top,
      userPosition: position?.rank ?? null,
      totalUsers: position?.total_users ?? null,
      scope: scopeInfo,
      membership: membershipInfo,
      canSelectOrganization: isSuperAdmin,
      rewards,
    })
  } catch (error) {
    console.error("Error en getRankingController:", error)
    return res.status(500).json({ error: "Error al obtener ranking" })
  }
}

const firstDayOfMonth = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
const lastDayOfMonth = (date: Date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 23, 59, 59, 999))

const threeMonthWindowFromDeadline = (deadline: Date) => {
  const end = lastDayOfMonth(deadline)
  const startMonth = new Date(Date.UTC(deadline.getUTCFullYear(), deadline.getUTCMonth() - 2, 1))
  const start = firstDayOfMonth(startMonth)
  return { start, end }
}

export const calculateGoalController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: "No autenticado" })

  try {
    const {
      deadline,
      includeOneShots = true,
      onlyBusinessDays = true,
      participantsOverride,
    } = req.body || {}

    if (!deadline) {
      return res.status(400).json({ error: "Falta deadline" })
    }

    const deadlineDate = new Date(deadline)
    if (Number.isNaN(deadlineDate.getTime())) {
      return res.status(400).json({ error: "Deadline inválido" })
    }

    const { start, end } = threeMonthWindowFromDeadline(deadlineDate)
    const startISO = start.toISOString().slice(0, 10)
    const endISO = end.toISOString().slice(0, 10)

    let usersCount = Number(participantsOverride || 0)
    if (!usersCount || usersCount <= 0) {
      usersCount = await countActiveParticipants(start.toISOString(), end.toISOString())
      if (usersCount <= 0) usersCount = 1
    }

    const pool = await getPool()
    const { rows } = await pool.query(
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

    const payload = Array.isArray(rows) && rows.length > 0 ? rows[0] : null
    const goal75 = Number(payload?.dept_target_75 ?? 5000)
    const rawTotal = Number(payload?.dept_total_ap ?? goal75)
    const perUserTotal = Number(payload?.per_user_total ?? 0)

    return res.json({
      goal75,
      rawTotal,
      perUserTotal,
      usersCount,
      startISO,
      endISO,
    })
  } catch (error) {
    console.error("Error en calculateGoalController:", error)
    return res.status(500).json({ error: "Error al calcular meta" })
  }
}
