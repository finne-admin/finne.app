import { Request, Response } from "express"
import fs from "fs"
import { getPool } from "../config/dbManager"
import { updateUserAvatarUrl } from "../db/queries/userQueries"
import { uploadAvatarImage } from "../services/avatarStorage"

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

export const updateAvatarUrlController = async (req: Request, res: Response) => {
  const authUser = (req as any).user
  if (!authUser?.id) {
    return res.status(401).json({ error: "Usuario no autenticado" })
  }

  const { avatarUrl } = req.body || {}
  if (typeof avatarUrl !== "string" || !avatarUrl.trim()) {
    return res.status(400).json({ error: "avatarUrl es requerido" })
  }

  try {
    const updated = await updateUserAvatarUrl(authUser.id, avatarUrl.trim())
    return res.json({ success: true, avatarUrl: updated?.avatar_url ?? avatarUrl })
  } catch (error) {
    console.error("Error actualizando avatar:", error)
    return res.status(500).json({ error: "No se pudo actualizar el avatar" })
  }
}

export const uploadAvatarController = async (req: Request, res: Response) => {
  const authUser = (req as any).user
  if (!authUser?.id) {
    return res.status(401).json({ error: "Usuario no autenticado" })
  }

  const file = req.file
  if (!file) {
    return res.status(400).json({ error: "Debes adjuntar un archivo" })
  }

  try {
    const url = await uploadAvatarImage(file.path, file.originalname, authUser.id, file.mimetype)
    await updateUserAvatarUrl(authUser.id, url)
    fs.unlink(file.path, () => {})
    return res.json({ success: true, avatarUrl: url })
  } catch (error) {
    console.error("Error subiendo avatar:", error)
    fs.unlink(file.path, () => {})
    return res.status(500).json({ error: "No se pudo subir el avatar" })
  }
}
