import { Request, Response } from "express"
import { getPool } from "../config/dbManager"

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

    const pool = await getPool()
    await pool.query(
      `
        INSERT INTO fcm_tokens (user_id, device_id, token, created_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (user_id, device_id)
        DO UPDATE SET
          token = EXCLUDED.token,
          created_at = NOW()
      `,
      [user.id, device_id, token]
    )

    return res.json({ success: true })
  } catch (err) {
    console.error("? Error guardando token FCM:", err)
    return res.status(500).json({ error: "Error interno al guardar token FCM." })
  }
}

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

    const pool = await getPool()
    await pool.query(
      `
        DELETE FROM fcm_tokens
        WHERE user_id = $1
          AND ($2::text IS NULL OR device_id = $2)
          AND ($3::text IS NULL OR token = $3)
      `,
      [user.id, device_id ?? null, token ?? null]
    )

    return res.json({ success: true })
  } catch (err) {
    console.error("? Error eliminando token FCM:", err)
    return res.status(500).json({ error: "Error interno al eliminar token FCM." })
  }
}
