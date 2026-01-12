import { Request, Response } from "express"
import { getUserCategoryCounts as getUserCategoryCountsQuery } from "../db/queries/exerciseQueries"

// Devuelve las categorias de video y su frecuencia para las pausas activas del usuario autenticado.
export const getUserCategoryCounts = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) return res.status(401).json({ error: "No autenticado" })

  try {
    const categories = await getUserCategoryCountsQuery(userId)
    return res.json({ categories })
  } catch (error) {
    console.error("Error en getUserCategoryCounts:", error)
    return res.status(500).json({ error: "Error al obtener categorias" })
  }
}
