import { getPool } from "../../config/dbManager"

export interface FavoriteRecord {
  id?: string
  video_hashed_id: string
  created_at?: Date
}

// Lista favoritos de un usuario en orden descendente de creacion.
export const listFavoritesByUser = async (userId: string): Promise<FavoriteRecord[]> => {
  const pool = await getPool()
  const { rows } = await pool.query<FavoriteRecord>(
    `
    SELECT video_hashed_id, created_at
    FROM exercise_favorites
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  )
  return rows
}

// Inserta un favorito si no existe. Devuelve el registro insertado o null si ya existia.
export const insertFavorite = async (
  userId: string,
  videoHashId: string
): Promise<FavoriteRecord | null> => {
  const pool = await getPool()
  const { rowCount, rows } = await pool.query<FavoriteRecord>(
    `
    INSERT INTO exercise_favorites (user_id, video_hashed_id)
    SELECT $1, $2
    WHERE NOT EXISTS (
      SELECT 1 FROM exercise_favorites WHERE user_id = $1 AND video_hashed_id = $2
    )
    RETURNING id, video_hashed_id, created_at
    `,
    [userId, videoHashId]
  )
  return rowCount > 0 ? rows[0] : null
}

// Elimina un favorito; devuelve true si se borro algo.
export const deleteFavorite = async (userId: string, videoHashId: string): Promise<boolean> => {
  const pool = await getPool()
  const { rowCount } = await pool.query(
    `
    DELETE FROM exercise_favorites
    WHERE user_id = $1 AND video_hashed_id = $2
    `,
    [userId, videoHashId]
  )
  return rowCount > 0
}
