import { Request, Response } from "express"
import fs from "fs"
import {
  RewardKey,
  RewardScopeType,
  deleteRewardDefinition,
  getRewardDefinitionsForScope,
  getRaffleThresholdsByOrganization,
  getRaffleCandidatesByOrganization,
  replaceRaffleThresholdsByOrganization,
  upsertRewardDefinition,
} from "../db/queries/rewardQueries"
import { getMembershipForUser } from "../db/queries/userMembershipQueries"
import { uploadRewardImage } from "../services/rewardStorage"
import { calculateRaffleEntriesForPoints } from "../services/rewardService"

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

const parseRewardKey = (value: any): RewardKey => {
  if (value === "guaranteed_winner" || value === "raffle_a" || value === "raffle_b") {
    return value
  }
  throw new Error("rewardKey inválido")
}

const rewardKeyFromPosition = (position: number): RewardKey => {
  if (position === 1) return "guaranteed_winner"
  if (position === 2) return "raffle_a"
  return "raffle_b"
}

const mapRow = (row: any) => ({
  id: row.id,
  scope_type: row.scope_type,
  scope_id: row.scope_id,
  position: row.position,
  reward_key: row.reward_key,
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
    const { scopeType: rawScopeType, scopeId, position, rewardKey, title, description, imageUrl, ctaUrl } =
      req.body || {}

    const scopeType = parseScopeType(rawScopeType)
    const normalizedScopeId = ensureScopeId(scopeType, scopeId)
    const numericPosition = Number(position)
    const normalizedRewardKey =
      typeof rewardKey === "string"
        ? parseRewardKey(rewardKey)
        : rewardKeyFromPosition(Number.isFinite(numericPosition) ? numericPosition : 3)

    const finalPosition =
      normalizedRewardKey === "guaranteed_winner"
        ? 1
        : normalizedRewardKey === "raffle_a"
          ? 2
          : 3

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "El título es obligatorio" })
    }

    const updated = await upsertRewardDefinition(
      scopeType,
      normalizedScopeId,
      normalizedRewardKey,
      title,
      typeof description === "string" ? description : null,
      typeof imageUrl === "string" ? imageUrl : null,
      typeof ctaUrl === "string" ? ctaUrl : null,
      (req as any).user?.id,
      finalPosition
    )

    return res.json({ success: true, reward: mapRow(updated) })
  } catch (error) {
    console.error("Error guardando recompensa:", error)
    return res.status(500).json({ error: "No se pudo guardar la recompensa" })
  }
}

export const listRaffleThresholdsController = async (req: Request, res: Response) => {
  try {
    const organizationId =
      typeof req.params.organizationId === "string" && req.params.organizationId.trim().length
        ? req.params.organizationId.trim()
        : null

    if (!organizationId) {
      return res.status(400).json({ error: "Falta organizationId" })
    }

    const thresholds = await getRaffleThresholdsByOrganization(organizationId)
    return res.json({ thresholds })
  } catch (error) {
    console.error("Error listando umbrales de sorteo:", error)
    return res.status(500).json({ error: "No se pudieron cargar los umbrales" })
  }
}

export const replaceRaffleThresholdsController = async (req: Request, res: Response) => {
  try {
    const organizationId =
      typeof req.params.organizationId === "string" && req.params.organizationId.trim().length
        ? req.params.organizationId.trim()
        : null

    if (!organizationId) {
      return res.status(400).json({ error: "Falta organizationId" })
    }

    const rawThresholds = Array.isArray(req.body?.thresholds) ? req.body.thresholds : null
    if (!rawThresholds) {
      return res.status(400).json({ error: "Debes enviar una lista de umbrales" })
    }

    const normalized = rawThresholds.map((item: any) => ({
      min_points: Number(item?.min_points),
      entries_count: Number(item?.entries_count),
      active: item?.active !== false,
    }))

    if (
      normalized.some(
        (item) =>
          !Number.isFinite(item.min_points) ||
          item.min_points <= 0 ||
          !Number.isFinite(item.entries_count) ||
          item.entries_count <= 0
      )
    ) {
      return res.status(400).json({ error: "Todos los umbrales deben tener puntos y participaciones válidos" })
    }

    const uniqueMinPoints = new Set(normalized.map((item) => item.min_points))
    if (uniqueMinPoints.size !== normalized.length) {
      return res.status(400).json({ error: "No puede haber umbrales duplicados" })
    }

    const thresholds = await replaceRaffleThresholdsByOrganization(
      organizationId,
      normalized.sort((a, b) => a.min_points - b.min_points),
      (req as any).user?.id ?? null
    )

    return res.json({ success: true, thresholds })
  } catch (error) {
    console.error("Error guardando umbrales de sorteo:", error)
    return res.status(500).json({ error: "No se pudieron guardar los umbrales" })
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

export const drawRaffleRewardController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    const userId = user?.id
    const roleName = user?.roleName?.toLowerCase()
    const isGlobalAdmin = roleName === "superadmin" || roleName === "soporte" || user?.roleScope === "global"
    const organizationId =
      typeof req.body?.organizationId === "string" && req.body.organizationId.trim().length
        ? req.body.organizationId.trim()
        : null
    const rewardKey = parseRewardKey(req.body?.rewardKey)

    if (rewardKey === "guaranteed_winner") {
      return res.status(400).json({ error: "El premio garantizado no se sortea" })
    }

    if (!organizationId) {
      return res.status(400).json({ error: "Debes indicar una organizacion" })
    }

    if (!isGlobalAdmin) {
      const membership = userId ? await getMembershipForUser(userId) : null
      if (!membership?.organization_id || membership.organization_id !== organizationId) {
        return res.status(403).json({ error: "No puedes sortear premios de otra organizacion" })
      }
    }

    const [thresholds, candidates] = await Promise.all([
      getRaffleThresholdsByOrganization(organizationId),
      getRaffleCandidatesByOrganization(organizationId),
    ])

    const activeThresholds = thresholds
      .filter((threshold) => threshold.active)
      .map((threshold) => ({
        id: threshold.id,
        organization_id: threshold.organization_id,
        min_points: Number(threshold.min_points ?? 0),
        entries_count: Number(threshold.entries_count ?? 0),
        active: Boolean(threshold.active),
      }))

    if (!activeThresholds.length) {
      return res.status(400).json({ error: "No hay umbrales activos para esta organizacion" })
    }

    const topUserId = candidates[0]?.id ?? null
    const weightedCandidates = candidates
      .filter((candidate) => candidate.id !== topUserId)
      .map((candidate) => ({
        id: candidate.id,
        first_name: candidate.first_name,
        last_name: candidate.last_name,
        avatar_url: candidate.avatar_url,
        periodical_exp: Number(candidate.periodical_exp ?? 0),
        entries: calculateRaffleEntriesForPoints(Number(candidate.periodical_exp ?? 0), activeThresholds),
      }))
      .filter((candidate) => candidate.entries > 0)

    const totalEntries = weightedCandidates.reduce((sum, candidate) => sum + candidate.entries, 0)
    if (totalEntries <= 0) {
      return res.status(400).json({ error: "No hay participantes con participaciones para este sorteo" })
    }

    let ticket = Math.floor(Math.random() * totalEntries) + 1
    let winner = weightedCandidates[0]
    for (const candidate of weightedCandidates) {
      ticket -= candidate.entries
      if (ticket <= 0) {
        winner = candidate
        break
      }
    }

    return res.json({
      rewardKey,
      organizationId,
      winner,
      totalEntries,
      eligibleUsers: weightedCandidates.length,
      excludedTopUserId: topUserId,
      drawnAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error realizando sorteo de recompensa:", error)
    return res.status(500).json({ error: "No se pudo realizar el sorteo" })
  }
}
