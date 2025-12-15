import { getPool } from "../../config/dbManager";

export const getDailyQuotaByUserId = async (userId: string, limit = 3) => {
  const pool = await getPool();

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const { rows } = await pool.query(
    `SELECT COUNT(*) AS count
     FROM active_pauses
     WHERE user_id = $1
       AND created_at >= $2
       AND created_at < $3`,
    [userId, start.toISOString(), end.toISOString()]
  );

  const usedToday = parseInt(rows[0]?.count ?? "0");
  const remainingToday = Math.max(0, limit - usedToday);

  return { usedToday, remainingToday };
};
