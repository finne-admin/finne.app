import { Request, Response } from "express"
import {
  getOrganizationCalendarSettingsById,
  listOrganizationBlackoutDatesById,
  listOrganizationCalendarSettings,
  replaceOrganizationBlackoutDates,
  updateOrganizationWeekendRules,
} from "../../db/queries/organizationCalendarQueries"

const isValidIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value)

export const listOrganizationCalendarController = async (_req: Request, res: Response) => {
  try {
    const organizations = await listOrganizationCalendarSettings()
    return res.json({ organizations })
  } catch (error) {
    console.error("Error cargando configuracion de calendario:", error)
    return res.status(500).json({ error: "Error al obtener la configuracion de calendario" })
  }
}

export const getOrganizationCalendarController = async (req: Request, res: Response) => {
  const { organizationId } = req.params

  if (!organizationId) {
    return res.status(400).json({ error: "Falta la organizacion" })
  }

  try {
    const [organization, blackoutDates] = await Promise.all([
      getOrganizationCalendarSettingsById(organizationId),
      listOrganizationBlackoutDatesById(organizationId),
    ])

    if (!organization) {
      return res.status(404).json({ error: "Organizacion no encontrada" })
    }

    return res.json({ organization, blackoutDates })
  } catch (error) {
    console.error("Error cargando calendario de organizacion:", error)
    return res.status(500).json({ error: "Error al obtener el calendario de la organizacion" })
  }
}

export const updateOrganizationCalendarController = async (req: Request, res: Response) => {
  const { organizationId } = req.params
  const userId = (req as any).user?.id ?? null
  const { disable_saturdays, disable_sundays, blackout_dates } = req.body || {}

  if (!organizationId) {
    return res.status(400).json({ error: "Falta la organizacion" })
  }

  if (typeof disable_saturdays !== "boolean" || typeof disable_sundays !== "boolean") {
    return res.status(400).json({ error: "Debes indicar las reglas de sabado y domingo" })
  }

  if (!Array.isArray(blackout_dates)) {
    return res.status(400).json({ error: "La lista de dias no laborables es invalida" })
  }

  const normalizedDates: Array<{ blocked_date: string; reason: string | null }> = []
  const seenDates = new Set<string>()

  for (const row of blackout_dates) {
    const blockedDate = typeof row?.blocked_date === "string" ? row.blocked_date.trim() : ""
    const reason = typeof row?.reason === "string" ? row.reason.trim() : ""

    if (!isValidIsoDate(blockedDate)) {
      return res.status(400).json({ error: "Todos los dias deben usar formato YYYY-MM-DD" })
    }

    if (seenDates.has(blockedDate)) continue
    seenDates.add(blockedDate)

    normalizedDates.push({
      blocked_date: blockedDate,
      reason: reason || null,
    })
  }

  try {
    const organization = await updateOrganizationWeekendRules(
      organizationId,
      disable_saturdays,
      disable_sundays
    )

    if (!organization) {
      return res.status(404).json({ error: "Organizacion no encontrada" })
    }

    await replaceOrganizationBlackoutDates(organizationId, normalizedDates, userId)
    const blackoutDates = await listOrganizationBlackoutDatesById(organizationId)

    return res.json({
      organization,
      blackoutDates,
    })
  } catch (error) {
    console.error("Error actualizando calendario de organizacion:", error)
    return res.status(500).json({ error: "Error al guardar el calendario de la organizacion" })
  }
}
