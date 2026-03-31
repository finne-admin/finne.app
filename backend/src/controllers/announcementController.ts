import { Request, Response } from "express"
import {
  getAnnouncementById,
  getPendingAnnouncementForUser,
  listAnnouncements,
  markAnnouncementRead,
  upsertAnnouncement,
} from "../db/queries/announcementQueries"
import { fetchOrganizationStructure, findOrganizationById } from "../db/queries/adminQueries"
import { getMembershipForUser } from "../db/queries/userMembershipQueries"

const mapAnnouncement = (row: any) => ({
  id: row.id,
  title: row.title,
  message: row.message,
  starts_at: row.starts_at,
  active: row.active,
  created_by: row.created_by,
  created_at: row.created_at,
  updated_at: row.updated_at,
  organization_ids: Array.isArray(row.organization_ids) ? row.organization_ids : [],
  organization_names: Array.isArray(row.organization_names) ? row.organization_names : [],
})

export const listAnnouncementsController = async (_req: Request, res: Response) => {
  try {
    const [announcements, structure] = await Promise.all([
      listAnnouncements(),
      fetchOrganizationStructure(),
    ])

    return res.json({
      announcements: announcements.map(mapAnnouncement),
      organizations: structure.orgs.map((org: any) => ({
        id: org.id,
        name: org.name,
        slug: org.slug,
      })),
    })
  } catch (error) {
    console.error("Error listando avisos:", error)
    return res.status(500).json({ error: "No se pudieron cargar los avisos" })
  }
}

export const upsertAnnouncementController = async (req: Request, res: Response) => {
  try {
    const idFromBody = typeof req.body?.id === "string" && req.body.id.trim().length ? req.body.id.trim() : undefined
    const idFromParams =
      typeof req.params?.id === "string" && req.params.id.trim().length ? req.params.id.trim() : undefined
    const id = idFromParams ?? idFromBody
    const title = typeof req.body?.title === "string" ? req.body.title.trim() : null
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : ""
    const startsAt = typeof req.body?.starts_at === "string" ? req.body.starts_at.trim() : ""
    const active = req.body?.active !== false
    const organizationIds = Array.isArray(req.body?.organization_ids)
      ? req.body.organization_ids.filter((value: unknown): value is string => typeof value === "string" && value.trim().length > 0)
      : []

    if (!message) {
      return res.status(400).json({ error: "El mensaje es obligatorio" })
    }
    if (!startsAt || Number.isNaN(new Date(startsAt).getTime())) {
      return res.status(400).json({ error: "La fecha y hora de inicio son inválidas" })
    }
    if (!organizationIds.length) {
      return res.status(400).json({ error: "Selecciona al menos una organización" })
    }

    for (const organizationId of organizationIds) {
      const org = await findOrganizationById(organizationId)
      if (!org) {
        return res.status(400).json({ error: "Hay organizaciones seleccionadas que no existen" })
      }
    }

    const saved = await upsertAnnouncement({
      id,
      title,
      message,
      startsAt,
      active,
      organizationIds,
      createdBy: (req as any).user?.id ?? null,
    })

    const full = await getAnnouncementById(saved.id)
    return res.json({ success: true, announcement: full ? mapAnnouncement(full) : mapAnnouncement(saved) })
  } catch (error) {
    console.error("Error guardando aviso:", error)
    return res.status(500).json({ error: "No se pudo guardar el aviso" })
  }
}

export const getCurrentAnnouncementController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) {
    return res.status(401).json({ error: "No autenticado" })
  }

  try {
    const membership = await getMembershipForUser(userId)
    const announcement = await getPendingAnnouncementForUser({
      userId,
      organizationId: membership?.organization_id ?? null,
    })

    return res.json({ announcement: announcement ? mapAnnouncement(announcement) : null })
  } catch (error) {
    console.error("Error cargando aviso actual:", error)
    return res.status(500).json({ error: "No se pudo cargar el aviso" })
  }
}

export const markAnnouncementReadController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id
  if (!userId) {
    return res.status(401).json({ error: "No autenticado" })
  }

  const announcementId = typeof req.params.id === "string" ? req.params.id.trim() : ""
  if (!announcementId) {
    return res.status(400).json({ error: "Falta el identificador del aviso" })
  }

  try {
    await markAnnouncementRead(announcementId, userId)
    return res.json({ success: true })
  } catch (error) {
    console.error("Error marcando aviso como leído:", error)
    return res.status(500).json({ error: "No se pudo marcar el aviso como leído" })
  }
}
