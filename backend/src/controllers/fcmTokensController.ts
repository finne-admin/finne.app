import { Request, Response } from "express"
import { deleteFcmTokenByFilter, upsertFcmToken } from "../db/queries/fcmTokenQueries"

// Guarda (o actualiza) el token FCM del usuario autenticado.
export const saveFcmToken = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    if (!user?.id) {
      return res.status(401).json({ error: "Usuario no autenticado" })
    }

    const { device_id, token } = req.body

    if (!device_id || !token) {
      return res.status(400).json({ error: "device_id y token son obligatorios" })
    }

    await upsertFcmToken(user.id, device_id, token)

    return res.json({ success: true })
  } catch (err) {
    console.error("Error guardando token FCM:", err)
    return res.status(500).json({ error: "Error interno al guardar token FCM." })
  }
}

// Elimina uno o varios tokens FCM asociados al usuario autenticado.
export const deleteFcmToken = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    if (!user?.id) {
      return res.status(401).json({ error: "Usuario no autenticado" })
    }

    const { device_id, token } = req.body

    if (!device_id && !token) {
      return res.status(400).json({ error: "Debe enviar device_id o token para borrar" })
    }

    await deleteFcmTokenByFilter(user.id, device_id ?? null, token ?? null)

    return res.json({ success: true })
  } catch (err) {
    console.error("Error eliminando token FCM:", err)
    return res.status(500).json({ error: "Error interno al eliminar token FCM." })
  }
}
