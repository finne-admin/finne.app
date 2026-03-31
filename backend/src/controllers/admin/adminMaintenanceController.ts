import { Request, Response } from "express"
import {
  fetchExerciseSatisfactionRecords,
  resetOrganizationScopeData,
} from "../../db/queries/adminQueries"
import { parsePgArray, validateOrganizationDepartmentScope } from "./shared"

export const getExerciseSatisfaction = async (req: Request, res: Response) => {
  const limitParam = req.query.limit ? parseInt(String(req.query.limit), 10) : 1000
  const limit = Number.isNaN(limitParam) ? 1000 : Math.min(Math.max(limitParam, 1), 5000)

  try {
    const rows = await fetchExerciseSatisfactionRecords(limit)

    const normalized = rows.map((row) => ({
      ...row,
      video_hash_ids: parsePgArray(row.video_hash_ids),
      tags: parsePgArray(row.tags),
      created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
    }))

    return res.json({ records: normalized })
  } catch (error) {
    console.error("Error fetching exercise satisfaction data:", error)
    return res.status(500).json({ error: "Error al obtener datos de ejercicios" })
  }
}

export const resetOrganizationDataController = async (req: Request, res: Response) => {
  const {
    organizationId,
    departmentId,
    resetGeneralAchievements,
    resetWeeklyAchievements,
    resetActivePauses,
    resetRanking,
  } = req.body || {}

  if (!organizationId) {
    return res.status(400).json({ error: "Falta la organizacion" })
  }

  const hasAny =
    Boolean(resetGeneralAchievements) ||
    Boolean(resetWeeklyAchievements) ||
    Boolean(resetActivePauses) ||
    Boolean(resetRanking)

  if (!hasAny) {
    return res.status(400).json({ error: "Selecciona al menos un parametro de reinicio" })
  }

  try {
    await validateOrganizationDepartmentScope(organizationId, departmentId ?? null)

    const result = await resetOrganizationScopeData({
      organizationId,
      departmentId: departmentId ?? null,
      resetGeneralAchievements: Boolean(resetGeneralAchievements),
      resetWeeklyAchievements: Boolean(resetWeeklyAchievements),
      resetActivePauses: Boolean(resetActivePauses),
      resetRanking: Boolean(resetRanking),
    })

    return res.json({ success: true, result })
  } catch (error) {
    if (error instanceof Error && error.message === "ORGANIZATION_NOT_FOUND") {
      return res.status(404).json({ error: "Organizacion no encontrada" })
    }
    if (error instanceof Error && error.message === "DEPARTMENT_NOT_FOUND") {
      return res.status(404).json({ error: "Departamento no encontrado" })
    }
    if (error instanceof Error && error.message === "DEPARTMENT_SCOPE_MISMATCH") {
      return res.status(400).json({
        error: "El departamento no pertenece a la organizacion seleccionada",
      })
    }

    console.error("Error en reinicio global:", error)
    return res.status(500).json({ error: "Error al ejecutar el reinicio" })
  }
}
