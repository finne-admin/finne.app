import { Request, Response } from "express"
import fs from "fs"
import {
  RewardScopeType,
  deleteRewardDefinition,
  getRewardDefinitionsForScope,
  upsertRewardDefinition,
} from "../db/queries/rewardQueries"
import { uploadRewardImage } from "../services/rewardStorage"

const parseScopeType = (value: any): RewardScopeType => {
  if (value === "organization" || value === "department") return value
  return "global"
}

const ensureScopeId = (scopeType: RewardScopeType, scopeId?: string | null) => {
  if (scopeType === "global") return null
  if (!scopeId) {
    throw new Error("Debes indicar una organización o departamento válido")
  }
  return scopeId
}

const mapRow = (row: any) => ({
  id: row.id,
  scope_type: row.scope_type,
  scope_id: row.scope_id,
  position: row.position,
  title: row.title,
  description: row.description,
  image_url: row.image_url,
  cta_url: row.cta_url,
  updated_by: row.updated_by,
  updated_at: row.updated_at,
})

export const listRewardDefinitionsController = async (req: Request, res: Response) => {
  try {
    const scopeType = parseScopeType(req.query.scopeType)
    const scopeId =
      typeof req.query.scopeId === "string" && req.query.scopeId.trim().length
        ? req.query.scopeId.trim()
        : undefined
    const normalizedScopeId = ensureScopeId(scopeType, scopeId)
    const rows = await getRewardDefinitionsForScope(scopeType, normalizedScopeId)
    return res.json({
      scope: { scopeType, scopeId: normalizedScopeId },
      rewards: rows.map(mapRow),
    })
  } catch (error) {
    console.error("Error listando recompensas:", error)
    return res.status(400).json({
      error: error instanceof Error ? error.message : "No se pudieron cargar las recompensas",
    })
  }
}

export const upsertRewardDefinitionController = async (req: Request, res: Response) => {
  try {
    const { scopeType: rawScopeType, scopeId, position, title, description, imageUrl, ctaUrl } =
      req.body || {}

    const scopeType = parseScopeType(rawScopeType)
    const normalizedScopeId = ensureScopeId(scopeType, scopeId)
    const numericPosition = Number(position)
    if (![1, 2, 3].includes(numericPosition)) {
      return res.status(400).json({ error: "La posición debe ser 1, 2 o 3" })
    }
    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "El título es obligatorio" })
    }

    const updated = await upsertRewardDefinition(
      scopeType,
      normalizedScopeId,
      numericPosition,
      title,
      typeof description === "string" ? description : null,
      typeof imageUrl === "string" ? imageUrl : null,
      typeof ctaUrl === "string" ? ctaUrl : null,
      (req as any).user?.id
    )

    return res.json({ success: true, reward: mapRow(updated) })
  } catch (error) {
    console.error("Error guardando recompensa:", error)
    return res.status(500).json({ error: "No se pudo guardar la recompensa" })
  }
}

export const deleteRewardDefinitionController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ error: "Falta el identificador de la recompensa" })
    }
    await deleteRewardDefinition(id)
    return res.json({ success: true })
  } catch (error) {
    console.error("Error eliminando recompensa:", error)
    return res.status(500).json({ error: "No se pudo eliminar la recompensa" })
  }
}

export const uploadRewardImageController = async (req: Request, res: Response) => {
  const file = req.file
  if (!file) {
    return res.status(400).json({ error: "Debes adjuntar un archivo" })
  }
  try {
    const url = await uploadRewardImage(file.path, file.originalname, file.mimetype)
    fs.unlink(file.path, () => {})
    return res.json({ success: true, url })
  } catch (error) {
    console.error("Error subiendo imagen de recompensa:", error)
    fs.unlink(file.path, () => {})
    return res.status(500).json({ error: "No se pudo subir la imagen" })
  }
}
