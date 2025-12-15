import { Request, Response } from "express"
import { getPool } from "../config/dbManager"

/**
 * 🟢 Actualizar nombre y apellidos de usuario
 */
export const updateUserProfile = async (req: Request, res: Response) => {
  const { id, first_name, last_name } = req.body

  if (!id) {
    return res.status(400).json({ error: "Falta el ID del usuario." })
  }

  try {
    const pool = await getPool()

    const query = `
      UPDATE users
      SET 
        first_name = COALESCE($2, first_name),
        last_name = COALESCE($3, last_name),
        updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, first_name, last_name, role_id
    `

    const { rows } = await pool.query(query, [id, first_name, last_name])

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." })
    }

    const { role_id, ...rest } = rows[0]
    return res.json({
      success: true,
      user: {
        ...rest,
        roleId: role_id,
      },
    })
  } catch (err) {
    console.error("❌ Error al actualizar usuario:", err)
    return res.status(500).json({ error: "Error interno al actualizar el usuario." })
  }
}
