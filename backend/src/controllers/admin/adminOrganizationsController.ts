import { Request, Response } from "express"
import {
  createDepartment,
  createOrganization,
  fetchOrganizationStructure,
  listOrganizationSeasonTimers as listOrganizationSeasonTimersQuery,
  updateOrganizationDailyLimitById,
  updateOrganizationSeasonTimerById,
} from "../../db/queries/adminQueries"
import {
  MAX_DAILY_PAUSES,
  MIN_DAILY_PAUSES,
  normalizeSlug,
  validateOrganizationDepartmentScope,
} from "./shared"

export const createOrganizationController = async (req: Request, res: Response) => {
  const { name, slug, maxDailyActivePauses } = req.body || {}
  const trimmedName = typeof name === "string" ? name.trim() : ""
  const trimmedSlug = typeof slug === "string" ? slug.trim() : ""

  if (!trimmedName) {
    return res.status(400).json({ error: "El nombre de la organizacion es obligatorio" })
  }

  const normalizedSlug = normalizeSlug(trimmedSlug || trimmedName)
  if (!normalizedSlug) {
    return res.status(400).json({ error: "El slug de la organizacion es invalido" })
  }

  try {
    let dailyLimit: number | undefined

    if (typeof maxDailyActivePauses !== "undefined") {
      const parsed = Number(maxDailyActivePauses)
      if (!Number.isFinite(parsed) || parsed < MIN_DAILY_PAUSES || parsed > MAX_DAILY_PAUSES) {
        return res.status(400).json({
          error: `El limite diario debe estar entre ${MIN_DAILY_PAUSES} y ${MAX_DAILY_PAUSES}`,
        })
      }

      dailyLimit = Math.floor(parsed)
    }

    const organization = await createOrganization(trimmedName, normalizedSlug, dailyLimit)
    return res.status(201).json({ organization })
  } catch (error: any) {
    if (error?.code === "23505") {
      return res.status(400).json({ error: "El nombre o slug ya existe" })
    }

    console.error("Error creando organizacion:", error)
    return res.status(500).json({ error: "Error al crear la organizacion" })
  }
}

export const createDepartmentController = async (req: Request, res: Response) => {
  const { organizationId, name } = req.body || {}
  const trimmedName = typeof name === "string" ? name.trim() : ""

  if (!organizationId || !trimmedName) {
    return res.status(400).json({ error: "Faltan organizacion o nombre del departamento" })
  }

  try {
    await validateOrganizationDepartmentScope(organizationId)
    const department = await createDepartment(organizationId, trimmedName)
    return res.status(201).json({ department })
  } catch (error: any) {
    if (error instanceof Error && error.message === "ORGANIZATION_NOT_FOUND") {
      return res.status(404).json({ error: "Organizacion no encontrada" })
    }
    if (error?.code === "23505") {
      return res.status(400).json({ error: "El departamento ya existe" })
    }

    console.error("Error creando departamento:", error)
    return res.status(500).json({ error: "Error al crear el departamento" })
  }
}

export const updateOrganizationDailyLimitController = async (req: Request, res: Response) => {
  const { id } = req.params
  const { maxDailyActivePauses } = req.body || {}

  if (!id) {
    return res.status(400).json({ error: "Falta el ID de la organizacion" })
  }

  const parsed = Number(maxDailyActivePauses)
  if (!Number.isFinite(parsed) || parsed < MIN_DAILY_PAUSES || parsed > MAX_DAILY_PAUSES) {
    return res.status(400).json({
      error: `El limite diario debe estar entre ${MIN_DAILY_PAUSES} y ${MAX_DAILY_PAUSES}`,
    })
  }

  try {
    const organization = await updateOrganizationDailyLimitById(id, Math.floor(parsed))
    if (!organization) {
      return res.status(404).json({ error: "Organizacion no encontrada" })
    }

    return res.json({ organization })
  } catch (error) {
    console.error("Error actualizando limite diario:", error)
    return res.status(500).json({ error: "Error al actualizar el limite diario" })
  }
}

export const listOrganizationSeasonTimers = async (_req: Request, res: Response) => {
  try {
    const organizations = await listOrganizationSeasonTimersQuery()
    return res.json({ organizations })
  } catch (error) {
    console.error("Error listando temporizadores de temporada:", error)
    return res.status(500).json({ error: "Error al obtener temporizadores de temporada" })
  }
}

export const updateOrganizationSeasonTimer = async (req: Request, res: Response) => {
  const { organizationId } = req.params
  const { season_deadline, season_timezone } = req.body || {}

  if (!organizationId) {
    return res.status(400).json({ error: "Falta el ID de la organizacion" })
  }

  let parsedDeadline: string | null = null
  if (season_deadline) {
    const date = new Date(season_deadline)
    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({ error: "Fecha de temporada invalida" })
    }
    parsedDeadline = date.toISOString().slice(0, 10)
  }

  const timezone =
    typeof season_timezone === "string" && season_timezone.trim().length
      ? season_timezone.trim()
      : null

  try {
    const organization = await updateOrganizationSeasonTimerById(
      organizationId,
      parsedDeadline,
      timezone
    )
    if (!organization) {
      return res.status(404).json({ error: "Organizacion no encontrada" })
    }

    return res.json({ organization })
  } catch (error) {
    console.error("Error actualizando temporizador de temporada:", error)
    return res.status(500).json({ error: "Error al actualizar temporizador de temporada" })
  }
}

export const getOrganizationStructure = async (_req: Request, res: Response) => {
  try {
    const { orgs, depts } = await fetchOrganizationStructure()

    const structure = orgs.map((org) => ({
      ...org,
      departments: depts.filter((dept) => dept.organization_id === org.id),
    }))

    return res.json({ organizations: structure })
  } catch (error) {
    console.error("Error obteniendo estructura:", error)
    return res.status(500).json({ error: "Error al obtener estructura" })
  }
}
