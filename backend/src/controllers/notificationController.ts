import { Request, Response } from "express"
import {
  deleteNotificationPreferencesByUser,
  findNotificationPreferences,
  getOrganizationNotificationDefaults,
  insertNotificationPreferences,
  upsertNotificationPreferencesQuery,
} from "../db/queries/notificationQueries"
import { getMembershipForUser } from "../db/queries/userMembershipQueries"

const toTimesArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return (value as unknown[]).map((item) => String(item))
  }
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      return trimmed
        .slice(1, -1)
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
    }
    return [trimmed]
  }
  return []
}

const FALLBACK_TIMES = ["10:30", "12:00", "15:45"]

// Obtiene preferencias de notificaciones; crea registro con defaults si no existe.
export const getNotificationPreferences = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user

    if (!user?.id) {
      return res.status(401).json({ error: "Usuario no autenticado" })
    }

    const existing = await findNotificationPreferences(user.id)
    if (existing) {
      return res.json(existing)
    }

    const membership = await getMembershipForUser(user.id)
    let defaultTimes = [...FALLBACK_TIMES]
    let defaultActive = true
    let defaultAllowWeekend = true

    if (membership?.organization_id) {
      const orgDefaults = await getOrganizationNotificationDefaults(membership.organization_id)
      if (orgDefaults) {
        const orgTimes = toTimesArray(orgDefaults.default_notification_times)
        if (orgTimes.length) {
          defaultTimes = orgTimes
        }
        if (typeof orgDefaults.default_notification_active === "boolean") {
          defaultActive = orgDefaults.default_notification_active
        }
        if (typeof orgDefaults.default_allow_weekend_notifications === "boolean") {
          defaultAllowWeekend = orgDefaults.default_allow_weekend_notifications
        }
      }
    }

    const inserted = await insertNotificationPreferences(
      user.id,
      defaultActive,
      defaultTimes,
      defaultAllowWeekend
    )

    res.json(inserted)
  } catch (err) {
    console.error("Error obteniendo preferencias:", err)
    res.status(500).json({ error: "Error al obtener preferencias" })
  }
}

// Inserta o actualiza preferencias (autenticadas).
export const upsertNotificationPreferences = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    if (!user?.id) {
      return res.status(401).json({ error: "Usuario no autenticado" })
    }

    const { active, times, allow_weekend_notifications } = req.body

    if (!Array.isArray(times)) {
      return res.status(400).json({ error: "El campo 'times' debe ser un array" })
    }

    const preferences = await upsertNotificationPreferencesQuery(
      user.id,
      active ?? true,
      times,
      allow_weekend_notifications ?? true
    )

    return res.json({ success: true, preferences })
  } catch (err) {
    console.error("Error guardando preferencias:", err)
    return res.status(500).json({ error: "Error interno al guardar preferencias." })
  }
}

// Elimina preferencias (autenticadas).
export const deleteNotificationPreferences = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    if (!user?.id) {
      return res.status(401).json({ error: "Usuario no autenticado" })
    }

    await deleteNotificationPreferencesByUser(user.id)

    return res.json({ success: true })
  } catch (err) {
    console.error("Error eliminando preferencias:", err)
    return res.status(500).json({ error: "Error interno al eliminar preferencias." })
  }
}
