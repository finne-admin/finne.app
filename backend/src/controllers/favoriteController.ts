import { Request, Response } from "express"
import { getPool } from "../config/dbManager"

const getAuthUserId = (req: Request): string | undefined => {
  const authUser = (req as any).user
  return authUser?.id
}

export const listFavorites = async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req)
    if (!userId) {
      return res.status(401).json({ error: "No autenticado" })
    }

    const pool = await getPool()
    const { rows } = await pool.query(
      `
      SELECT video_hashed_id, created_at
      FROM exercise_favorites
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    )

    return res.json({ favorites: rows })
  } catch (error) {
    console.error("Error al obtener favoritos:", error)
    return res.status(500).json({ error: "Error interno al obtener favoritos" })
  }
}

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req)
    if (!userId) {
      return res.status(401).json({ error: "No autenticado" })
    }

    const { video_hashed_id } = req.body || {}
    if (typeof video_hashed_id !== "string" || !video_hashed_id.trim()) {
      return res.status(400).json({ error: "Falta video_hashed_id" })
    }

    const pool = await getPool()
    const { rowCount, rows } = await pool.query(
      `
      INSERT INTO exercise_favorites (user_id, video_hashed_id)
      SELECT $1, $2
      WHERE NOT EXISTS (
        SELECT 1 FROM exercise_favorites WHERE user_id = $1 AND video_hashed_id = $2
      )
      RETURNING id, created_at
      `,
      [userId, video_hashed_id.trim()]
    )

    return res.status(rowCount > 0 ? 201 : 200).json({
      added: rowCount > 0,
      favorite: rows[0] ?? null,
    })
  } catch (error) {
    console.error("Error al agregar favorito:", error)
    return res.status(500).json({ error: "Error interno al agregar favorito" })
  }
}

export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req)
    if (!userId) {
      return res.status(401).json({ error: "No autenticado" })
    }

    const { video_hashed_id } = req.body || {}
    if (typeof video_hashed_id !== "string" || !video_hashed_id.trim()) {
      return res.status(400).json({ error: "Falta video_hashed_id" })
    }

    const pool = await getPool()
    const { rowCount } = await pool.query(
      `
      DELETE FROM exercise_favorites
      WHERE user_id = $1 AND video_hashed_id = $2
      `,
      [userId, video_hashed_id.trim()]
    )

    return res.json({ removed: rowCount > 0 })
  } catch (error) {
    console.error("Error al eliminar favorito:", error)
    return res.status(500).json({ error: "Error interno al eliminar favorito" })
  }
}
