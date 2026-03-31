import { Request, Response } from "express"
import {
  listOrganizationNotificationDefaults as listOrganizationNotificationDefaultsQuery,
  updateOrganizationNotificationDefaultsById,
} from "../../db/queries/adminQueries"
import { normalizeTimesByDay, normalizeTimesInput, parsePgArray } from "./shared"

export const listOrganizationNotificationDefaults = async (_req: Request, res: Response) => {
  try {
    const rows = await listOrganizationNotificationDefaultsQuery()

    const organizations = rows.map((org) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      times: parsePgArray(org.default_notification_times),
      times_by_day: org.default_notification_times_by_day ?? null,
      active: org.default_notification_active ?? true,
      allow_weekend_notifications: org.default_allow_weekend_notifications ?? true,
    }))

    return res.json({ organizations })
  } catch (error) {
    console.error("Error listando horarios por defecto:", error)
    return res.status(500).json({ error: "Error al obtener horarios por defecto" })
  }
}

export const updateOrganizationNotificationDefaults = async (req: Request, res: Response) => {
  const { organizationId } = req.params
  const { times, times_by_day, active, allow_weekend_notifications } = req.body || {}

  if (!organizationId) {
    return res.status(400).json({ error: "Falta el identificador de la organizacion" })
  }

  let normalizedTimes: string[]
  let normalizedTimesByDay: Record<string, string[]> | null | undefined = undefined

  try {
    normalizedTimes = normalizeTimesInput(times)
    normalizedTimesByDay = normalizeTimesByDay(times_by_day)
  } catch (err) {
    return res.status(400).json({
      error: err instanceof Error ? err.message : "Horarios invalidos",
    })
  }

  const activeValue = typeof active === "boolean" ? active : undefined
  const allowWeekendValue =
    typeof allow_weekend_notifications === "boolean" ? allow_weekend_notifications : undefined

  try {
    const hasTimesByDay = normalizedTimesByDay !== undefined
    const organization = await updateOrganizationNotificationDefaultsById(
      organizationId,
      normalizedTimes,
      normalizedTimesByDay ?? null,
      hasTimesByDay,
      activeValue,
      allowWeekendValue
    )

    if (!organization) {
      return res.status(404).json({ error: "Organizacion no encontrada" })
    }

    return res.json({
      success: true,
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        times: parsePgArray(organization.default_notification_times),
        times_by_day: organization.default_notification_times_by_day ?? null,
        active: organization.default_notification_active ?? true,
        allow_weekend_notifications: organization.default_allow_weekend_notifications ?? true,
      },
    })
  } catch (error) {
    console.error("Error actualizando horarios por organizacion:", error)
    return res.status(500).json({ error: "Error al actualizar horarios por defecto" })
  }
}
