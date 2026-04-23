import { Request, Response } from "express"
import fs from "fs"
import {
  ErrorReportStatus,
  insertErrorReport,
  listErrorReportsByUser,
  listErrorReports,
  markErrorReportReplyAsRead,
  updateErrorReportStatus,
} from "../db/queries/reportQueries"
import { uploadReportImage } from "../services/reportStorage"

const MAX_MESSAGE_LENGTH = 1000
const MAX_CATEGORY_LENGTH = 64
const MAX_ADMIN_REPLY_LENGTH = 2000
const MAX_ATTACHMENT_URL_LENGTH = 2048
const MAX_REPORT_IMAGE_BYTES = 8 * 1024 * 1024

const normalizeAttachmentUrl = (value: unknown) => {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

const isAllowedImageMimeType = (value?: string | null) =>
  value === "image/png" ||
  value === "image/jpeg" ||
  value === "image/webp" ||
  value === "image/gif"

export const createErrorReportController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    if (!user?.id) {
      return res.status(401).json({ error: "No autenticado" })
    }

    const { category, message, page_path, attachment_url } = req.body || {}
    const trimmedCategory = typeof category === "string" ? category.trim() : ""
    const trimmedMessage = typeof message === "string" ? message.trim() : ""
    const normalizedAttachmentUrl = normalizeAttachmentUrl(attachment_url)

    if (!trimmedCategory) {
      return res.status(400).json({ error: "Selecciona una categoria" })
    }
    if (trimmedCategory.length > MAX_CATEGORY_LENGTH) {
      return res.status(400).json({ error: "Categoria demasiado larga" })
    }
    if (!trimmedMessage || trimmedMessage.length < 5) {
      return res.status(400).json({ error: "Describe el problema con mas detalle" })
    }
    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: "El mensaje es demasiado largo" })
    }
    if (normalizedAttachmentUrl && normalizedAttachmentUrl.length > MAX_ATTACHMENT_URL_LENGTH) {
      return res.status(400).json({ error: "La URL de la imagen es demasiado larga" })
    }

    const created = await insertErrorReport({
      userId: user.id,
      category: trimmedCategory,
      message: trimmedMessage,
      pagePath: typeof page_path === "string" ? page_path.trim() : null,
      userAgent: typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : null,
      attachmentUrl: normalizedAttachmentUrl,
    })

    return res.json({ success: true, report: created })
  } catch (error) {
    console.error("Error creando reporte:", error)
    return res.status(500).json({ error: "Error interno al guardar el reporte" })
  }
}

export const listErrorReportsController = async (req: Request, res: Response) => {
  try {
    const limitParam = typeof req.query.limit === "string" ? Number(req.query.limit) : 200
    const reports = await listErrorReports(limitParam)
    return res.json({ reports })
  } catch (error) {
    console.error("Error listando reportes:", error)
    return res.status(500).json({ error: "Error al obtener los reportes" })
  }
}

export const listMyErrorReportsController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    if (!user?.id) {
      return res.status(401).json({ error: "No autenticado" })
    }

    const reports = await listErrorReportsByUser(user.id)
    return res.json({ reports })
  } catch (error) {
    console.error("Error listando reportes del usuario:", error)
    return res.status(500).json({ error: "Error al obtener tus reportes" })
  }
}

export const updateErrorReportStatusController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    if (!user?.id) {
      return res.status(401).json({ error: "No autenticado" })
    }

    const { id } = req.params
    const rawStatus = typeof req.body?.status === "string" ? req.body.status.trim().toLowerCase() : ""
    const rawReply = typeof req.body?.admin_reply === "string" ? req.body.admin_reply.trim() : ""
    const rawAttachmentUrl = normalizeAttachmentUrl(req.body?.admin_attachment_url)
    const allowedStatuses: ErrorReportStatus[] = ["pending", "resolved", "dismissed"]

    if (!id) {
      return res.status(400).json({ error: "Falta el id del reporte" })
    }
    if (!allowedStatuses.includes(rawStatus as ErrorReportStatus)) {
      return res.status(400).json({ error: "Estado de reporte no valido" })
    }
    if (rawReply.length > MAX_ADMIN_REPLY_LENGTH) {
      return res.status(400).json({ error: "La respuesta es demasiado larga" })
    }
    if (rawAttachmentUrl && rawAttachmentUrl.length > MAX_ATTACHMENT_URL_LENGTH) {
      return res.status(400).json({ error: "La URL de la imagen es demasiado larga" })
    }
    if (
      (rawStatus === "resolved" || rawStatus === "dismissed") &&
      !rawReply &&
      !rawAttachmentUrl &&
      req.body?.require_reply === true
    ) {
      return res.status(400).json({ error: "Debes escribir una respuesta o adjuntar una imagen" })
    }

    const updated = await updateErrorReportStatus(
      id,
      rawStatus as ErrorReportStatus,
      user.id,
      rawReply || null,
      rawAttachmentUrl
    )
    if (!updated) {
      return res.status(404).json({ error: "Reporte no encontrado" })
    }

    return res.json({ success: true, report: updated })
  } catch (error) {
    console.error("Error actualizando estado del reporte:", error)
    return res.status(500).json({ error: "Error al actualizar el estado del reporte" })
  }
}

const uploadImageForReport = async (
  req: Request,
  res: Response,
  kind: "user" | "admin"
) => {
  const user = (req as any).user
  if (!user?.id) {
    return res.status(401).json({ error: "No autenticado" })
  }

  const file = req.file
  if (!file) {
    return res.status(400).json({ error: "Debes adjuntar una imagen" })
  }

  try {
    if (!isAllowedImageMimeType(file.mimetype)) {
      return res.status(400).json({ error: "Formato no permitido. Usa PNG, JPG, WEBP o GIF" })
    }
    if (file.size > MAX_REPORT_IMAGE_BYTES) {
      return res.status(400).json({ error: "La imagen no puede superar 8 MB" })
    }

    const url = await uploadReportImage(file.path, file.originalname, user.id, kind, file.mimetype)
    return res.json({ success: true, url })
  } catch (error) {
    console.error("Error subiendo imagen del report:", error)
    return res.status(500).json({ error: "No se pudo subir la imagen" })
  } finally {
    if (file?.path) {
      fs.unlink(file.path, () => {})
    }
  }
}

export const uploadReportAttachmentController = async (req: Request, res: Response) =>
  uploadImageForReport(req, res, "user")

export const uploadAdminReportAttachmentController = async (req: Request, res: Response) =>
  uploadImageForReport(req, res, "admin")

export const markMyErrorReportReadController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    if (!user?.id) {
      return res.status(401).json({ error: "No autenticado" })
    }

    const { id } = req.params
    if (!id) {
      return res.status(400).json({ error: "Falta el id del reporte" })
    }

    const updated = await markErrorReportReplyAsRead(id, user.id)
    if (!updated) {
      return res.status(404).json({ error: "Reporte no encontrado o sin respuesta pendiente de lectura" })
    }

    return res.json({ success: true, report: updated })
  } catch (error) {
    console.error("Error marcando respuesta de reporte como leida:", error)
    return res.status(500).json({ error: "Error al confirmar lectura de la respuesta" })
  }
}
