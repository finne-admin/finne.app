import { Request, Response } from "express"
import { addUserXP, getUserXpHistory } from "../db/queries/xpQueries"

export const addXP = async (req: Request, res: Response) => {
  try {
    const { user_id, points, meta } = req.body

    if (!user_id || typeof points !== "number") {
      return res.status(400).json({ error: "Faltan campos obligatorios (user_id, points)" })
    }

    console.log(`Añadiendo ${points} XP al usuario ${user_id}`)

    const result = await addUserXP(user_id, points, meta)

    if (!result) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    return res.json({
      success: true,
      user_id: result.id,
      new_exp_total: result.exp,
      added_points: result.added_points ?? points,
    })
  } catch (err) {
    console.error("Error añadiendo XP:", err)
    return res.status(500).json({ error: "Error interno añadiendo XP" })
  }
}

export const getXpHistoryController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    if (!userId) return res.status(401).json({ error: "No autenticado" })

    const limit = Number(req.query.limit ?? 20)
    const offset = Number(req.query.offset ?? 0)

    const history = await getUserXpHistory(userId, limit, offset)
    return res.json({ history })
  } catch (error) {
    console.error("Error obteniendo historial de XP:", error)
    return res.status(500).json({ error: "Error interno obteniendo historial de XP" })
  }
}
