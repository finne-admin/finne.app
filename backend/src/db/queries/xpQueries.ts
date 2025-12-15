import { getPool } from "../../config/dbManager"

const DAILY_ACTIVE_PAUSE_CAP = Number(process.env.ACTIVE_PAUSE_DAILY_CAP || "60")

/**
 * Añade XP a un usuario y registra el evento en activity_points.
 * Aplica un tope diario cuando la fuente es una pausa activa.
 */
export const addUserXP = async (userId: string, points: number, meta?: Record<string, any>) => {
  const pool = await getPool()
  let appliedPoints = points

  if (meta?.source === "active_pause" && DAILY_ACTIVE_PAUSE_CAP > 0) {
    const { rows } = await pool.query<{ total: string | null }>(
      `
      SELECT COALESCE(SUM(points), 0) AS total
      FROM activity_points
      WHERE user_id = $1
        AND action_type = 'xp_gain'
        AND metadata->>'source' = 'active_pause'
        AND created_at::date = CURRENT_DATE
      `,
      [userId]
    )

    const todaysTotal = Number(rows[0]?.total ?? 0)
    const remaining = Math.max(DAILY_ACTIVE_PAUSE_CAP - todaysTotal, 0)
    appliedPoints = Math.min(appliedPoints, remaining)
  }

  if (appliedPoints <= 0) {
    const { rows } = await pool.query(`SELECT id, exp FROM users WHERE id = $1`, [userId])
    const userRow = rows[0] || null
    return userRow ? { ...userRow, added_points: 0 } : null
  }

  await pool.query(
    `INSERT INTO activity_points (user_id, action_type, points, metadata, created_at)
     VALUES ($1, $2, $3, $4, NOW())`,
    [userId, "xp_gain", appliedPoints, meta || {}]
  )

  const { rows } = await pool.query(
    `
    UPDATE users
    SET exp = COALESCE(exp, 0) + $1
    WHERE id = $2
    RETURNING id, exp
    `,
    [appliedPoints, userId]
  )

  const updatedUser = rows[0] || null
  return updatedUser ? { ...updatedUser, added_points: appliedPoints } : null
}

/**
 * Devuelve historial de XP para un usuario.
 */
export const getUserXpHistory = async (userId: string, limit: number, offset: number) => {
  const pool = await getPool()
  const safeLimit = Math.min(Math.max(limit, 1), 100)
  const safeOffset = Math.max(offset, 0)

  const { rows } = await pool.query(
    `
    SELECT id, action_type, points, metadata, created_at
    FROM activity_points
    WHERE user_id = $1 AND action_type = 'xp_gain'
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
    `,
    [userId, safeLimit, safeOffset]
  )

  return rows
}
