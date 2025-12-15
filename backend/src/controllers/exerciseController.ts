import { Request, Response } from "express"
import { getPool } from "../config/dbManager"

export const getUserCategoryCounts = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: "No autenticado" })

  try {
    const pool = await getPool()
    const { rows } = await pool.query(
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

    return res.json({ categories: rows })
  } catch (error) {
    console.error("Error en getUserCategoryCounts:", error)
    return res.status(500).json({ error: "Error al obtener categorias" })
  }
}
