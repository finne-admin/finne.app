import { Request, Response } from "express";
import { DateTime } from "luxon";
import { getGlobalStatistics, getUserStatistics } from "../db/queries/statisticsQueries";
import { getMembershipForUser } from "../db/queries/userMembershipQueries";
import { getWeeklyActivityPauses } from "../db/queries/milestonesQueries";
import { getUserXpHistoryWithFilters } from "../db/queries/xpQueries";

export const getUserStatisticsController = async (req: Request, res: Response) => {
  try {
    // Obtener el usuario autenticado desde el middleware
    const authUser = (req as any).user;

    if (!authUser?.id) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const userId: string = authUser.id;

    const stats = await getUserStatistics(userId);

    // Generar insights básicos
    const insights: string[] = [];

    if (Number(stats.summary.weekly_sessions) > 0) {
      insights.push("💪 Has completado varias pausas esta semana. ¡Sigue así!");
    }

    if (stats.category_distribution.length > 0) {
      const topCategory = stats.category_distribution[0].category;
      insights.push(`🔥 Tu categoría más frecuente es ${topCategory}.`);
    }

    if (stats.weekly_pattern.length > 0) {
      const topDay = stats.weekly_pattern[0].day_of_week.trim();
      insights.push(`📅 Sueles hacer más ejercicio los ${topDay.toLowerCase()}.`);
    }

    const avgSat = Number(stats.summary.avg_satisfaction);
    if (avgSat >= 4.5)
      insights.push("😊 Te sientes muy satisfecho con tus sesiones últimamente.");
    else if (avgSat < 3)
      insights.push("😕 Tu satisfacción está baja, prueba otro tipo de ejercicio.");

    res.json({
      ...stats,
      insights,
    });
  } catch (err) {
    console.error("Error al obtener estadísticas:", err);
    res.status(500).json({ error: "Error interno al obtener estadísticas" });
  }
};

export const getGlobalStatisticsController = async (req: Request, res: Response) => {
  try {
    const organizationId =
      typeof req.query.organizationId === "string" && req.query.organizationId.length
        ? req.query.organizationId
        : undefined
    const departmentId =
      typeof req.query.departmentId === "string" && req.query.departmentId.length
        ? req.query.departmentId
        : undefined

    const stats = await getGlobalStatistics({ organizationId, departmentId })
    return res.json(stats)
  } catch (error) {
    console.error("Error al obtener estadísticas globales:", error)
    return res.status(500).json({ error: "Error interno al obtener estadísticas globales" })
  }
}

export const getScopedStatisticsController = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user
    if (!authUser?.id) return res.status(401).json({ error: "No autenticado" })

    const roleName = authUser.roleName?.toLowerCase()
    let filters: { organizationId?: string | null; departmentId?: string | null } | undefined

    if (roleName === "superadmin" || roleName === "soporte") {
      const organizationId =
        typeof req.query.organizationId === "string" && req.query.organizationId.trim().length
          ? req.query.organizationId.trim()
          : undefined
      const departmentId =
        typeof req.query.departmentId === "string" && req.query.departmentId.trim().length
          ? req.query.departmentId.trim()
          : undefined
      filters = { organizationId, departmentId }
    } else {
      const membership = await getMembershipForUser(authUser.id)
      if (!membership?.organization_id) {
        return res.status(400).json({ error: "Tu cuenta no tiene organización asignada" })
      }
      filters = {
        organizationId: membership.organization_id,
      }
    }

    const stats = await getGlobalStatistics(filters)
    return res.json(stats)
  } catch (error) {
    console.error("Error al obtener estadísticas del panel:", error)
    return res.status(500).json({ error: "Error interno al obtener estadísticas" })
  }
}

export const getUserStatisticsForAdminController = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user
    if (!authUser?.id) return res.status(401).json({ error: "No autenticado" })

    const targetUserId = req.params.userId
    if (!targetUserId) return res.status(400).json({ error: "Falta el usuario solicitado" })

    const roleName = authUser.roleName?.toLowerCase()
    const isGlobalAdmin = roleName === "superadmin" || roleName === "soporte"

    if (!isGlobalAdmin) {
      const requesterMembership = await getMembershipForUser(authUser.id)
      if (!requesterMembership?.organization_id) {
        return res.status(403).json({ error: "No tienes una organización asignada" })
      }
      const targetMembership = await getMembershipForUser(targetUserId)
      if (
        !targetMembership?.organization_id ||
        targetMembership.organization_id !== requesterMembership.organization_id
      ) {
        return res.status(403).json({ error: "No autorizado para ver este usuario" })
      }
    }

    const stats = await getUserStatistics(targetUserId)
    const xpLimitRaw = typeof req.query.xpLimit === "string" ? Number(req.query.xpLimit) : 10
    const xpOffsetRaw = typeof req.query.xpOffset === "string" ? Number(req.query.xpOffset) : 0
    const xpLimit = Number.isFinite(xpLimitRaw) ? xpLimitRaw : 10
    const xpOffset = Number.isFinite(xpOffsetRaw) ? xpOffsetRaw : 0
    const normalizeDateRange = (value: string | null, mode: "start" | "end") => {
      if (!value) return null
      const trimmed = value.trim()
      if (!trimmed) return null
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return mode === "start"
          ? `${trimmed}T00:00:00.000Z`
          : `${trimmed}T23:59:59.999Z`
      }
      return trimmed
    }
    const xpFrom = typeof req.query.xpFrom === "string" ? req.query.xpFrom : null
    const xpTo = typeof req.query.xpTo === "string" ? req.query.xpTo : null
    const xpFilters = {
      from: normalizeDateRange(xpFrom, "start"),
      to: normalizeDateRange(xpTo, "end"),
    }
    const { rows: xpHistory, total: xpTotal } = await getUserXpHistoryWithFilters(
      targetUserId,
      xpLimit,
      xpOffset,
      xpFilters
    )

    const zone = "Europe/Madrid"
    const weekStart = DateTime.now().setZone(zone).startOf("week")
    const weekEnd = weekStart.plus({ days: 7 })
    const weeklyPauses = await getWeeklyActivityPauses(targetUserId)
    const activeDays = new Set<number>()

    weeklyPauses.forEach((row) => {
      const dt = DateTime.fromJSDate(new Date(row.created_at)).setZone(zone)
      if (dt >= weekStart && dt < weekEnd) {
        activeDays.add(dt.weekday)
      }
    })

    return res.json({
      ...stats,
      weeklyActiveDays: Array.from(activeDays).sort((a, b) => a - b),
      xpHistory,
      xpTotal,
    })
  } catch (error) {
    console.error("Error al obtener estadísticas del usuario:", error)
    return res.status(500).json({ error: "Error interno al obtener estadísticas del usuario" })
  }
}
