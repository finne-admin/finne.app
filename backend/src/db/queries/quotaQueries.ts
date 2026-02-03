import { DateTime } from "luxon";
import { getPool } from "../../config/dbManager";

const DEFAULT_TIMEZONE = "Europe/Madrid";

export const getDailyQuotaByUserId = async (
  userId: string,
  limit = 3,
  timezone = DEFAULT_TIMEZONE
) => {
  const pool = await getPool();

  const start = DateTime.now().setZone(timezone).startOf("day");
  const end = start.plus({ days: 1 });

  const { rows } = await pool.query(
    `SELECT COUNT(*) AS count
     FROM active_pauses
     WHERE user_id = $1
       AND created_at >= $2
       AND created_at < $3`,
    [userId, start.toUTC().toISO(), end.toUTC().toISO()]
  );

  const usedToday = parseInt(rows[0]?.count ?? "0");
  const remainingToday = Math.max(0, limit - usedToday);

  return { usedToday, remainingToday };
};

export const listDailyActivePausesByUserId = async (
  userId: string,
  timezone = DEFAULT_TIMEZONE
) => {
  const pool = await getPool();
  const start = DateTime.now().setZone(timezone).startOf("day");
  const end = start.plus({ days: 1 });

  const { rows } = await pool.query<{ created_at: Date }>(
    `SELECT created_at
     FROM active_pauses
     WHERE user_id = $1
       AND created_at >= $2
       AND created_at < $3
     ORDER BY created_at ASC`,
    [userId, start.toUTC().toISO(), end.toUTC().toISO()]
  );

  return rows.map((row) => row.created_at.toISOString());
};
