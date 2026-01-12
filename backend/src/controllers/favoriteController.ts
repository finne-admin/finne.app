import { Request, Response } from "express"
import {
  deleteFavorite,
  insertFavorite,
  listFavoritesByUser,
} from "../db/queries/favoriteQueries"

const getAuthUserId = (req: Request): string | undefined => {
  const authUser = (req as any).user
  return authUser?.id
}

// Lista favoritos del usuario autenticado.
export const listFavorites = async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req)
    if (!userId) {
      return res.status(401).json({ error: "No autenticado" })
    }

    const favorites = await listFavoritesByUser(userId)
    return res.json({ favorites })
  } catch (error) {
    console.error("Error al obtener favoritos:", error)
    return res.status(500).json({ error: "Error interno al obtener favoritos" })
  }
}

// Inserta un favorito si no existe; idempotente.
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

    const favorite = await insertFavorite(userId, video_hashed_id.trim())

    return res.status(favorite ? 201 : 200).json({
      added: Boolean(favorite),
      favorite: favorite ?? null,
    })
  } catch (error) {
    console.error("Error al agregar favorito:", error)
    return res.status(500).json({ error: "Error interno al agregar favorito" })
  }
}

// Elimina un favorito existente.
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

    const removed = await deleteFavorite(userId, video_hashed_id.trim())

    return res.json({ removed })
  } catch (error) {
    console.error("Error al eliminar favorito:", error)
    return res.status(500).json({ error: "Error interno al eliminar favorito" })
  }
}
