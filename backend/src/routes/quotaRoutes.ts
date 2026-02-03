import express from "express";
import { requireAuth } from "../middlewares/verifyToken";
import { getDailyQuotaByUserId, listDailyActivePausesByUserId } from "../db/queries/quotaQueries";
import { getDailyActivePauseLimitForUser, getMembershipForUser } from "../db/queries/userMembershipQueries";
import { getOrganizationNotificationDefaults } from "../db/queries/notificationQueries";

const router = express.Router();
const DEFAULT_TIMEZONE = "Europe/Madrid";
const FALLBACK_TIMES = ["10:30", "12:00", "15:45"];

const toTimesArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return (value as unknown[]).map((item) => String(item));
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      return trimmed
        .slice(1, -1)
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
    }
    return [trimmed];
  }
  return [];
};

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
        const orgTimes = toTimesArray(orgDefaults.default_notification_times);
        if (orgTimes.length) {
          times = orgTimes;
        }
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
