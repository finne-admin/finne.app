import express from "express";
import { requireAuth } from "../middlewares/verifyToken";
import { getDailyQuotaByUserId, listDailyActivePausesByUserId } from "../db/queries/quotaQueries";
import { getDailyActivePauseLimitForUser, getMembershipForUser } from "../db/queries/userMembershipQueries";
import { getOrganizationNotificationDefaults } from "../db/queries/notificationQueries";
import { DateTime } from "luxon";
import { resolveOrgTimesForDate } from "../utils/notificationTimes";

const router = express.Router();
const DEFAULT_TIMEZONE = "Europe/Madrid";
const FALLBACK_TIMES = ["10:30", "12:00", "15:45"];

const nowInZone = () => DateTime.now().setZone(DEFAULT_TIMEZONE);

// cupo diario
router.get("/daily", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const limit = await getDailyActivePauseLimitForUser(userId);

    const membership = await getMembershipForUser(userId);
    let times = [...FALLBACK_TIMES];
    if (membership?.organization_id) {
      const orgDefaults = await getOrganizationNotificationDefaults(membership.organization_id);
      if (orgDefaults) {
        times = resolveOrgTimesForDate(orgDefaults, nowInZone(), times);
      }
    }
    const sortedTimes = times
      .map((value) => value.trim())
      .filter(Boolean)
      .sort();
    const windowTimes = sortedTimes.length > limit ? sortedTimes.slice(0, limit) : sortedTimes;

    const { usedToday, remainingToday } = await getDailyQuotaByUserId(
      userId,
      limit,
      DEFAULT_TIMEZONE
    );
    const pausesToday = await listDailyActivePausesByUserId(userId, DEFAULT_TIMEZONE);

    res.json({
      usedToday,
      remainingToday,
      limit,
      times: windowTimes,
      timezone: DEFAULT_TIMEZONE,
      pausesToday,
    });
  } catch (err) {
    console.error("Error al consultar cupo diario:", err);
    res.status(500).json({ error: "Error al consultar cupo diario" });
  }
});

export default router;
