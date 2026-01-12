import { getPool } from "../../config/dbManager"

export interface UserCategoryCount {
  category: string
  count: number
}

// Devuelve los conteos de categorias de videos reproducidos en pausas activas por usuario.
export const getUserCategoryCounts = async (userId: string): Promise<UserCategoryCount[]> => {
  const pool = await getPool()
  const { rows } = await pool.query<UserCategoryCount>(
    `
    WITH video_ids AS (
      SELECT video1_id AS video_id, user_id FROM active_pauses WHERE user_id = $1
      UNION ALL
      SELECT video2_id AS video_id, user_id FROM active_pauses WHERE user_id = $1
    )
    SELECT
      UNNEST(v.categorias)::text AS category,
      COUNT(*)::int AS count
    FROM video_ids vi
    JOIN videos v ON v.id = vi.video_id
    GROUP BY category
    ORDER BY count DESC, category ASC
    `,
    [userId]
  )
  return rows
}
