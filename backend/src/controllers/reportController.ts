import { Request, Response } from "express"
import {
  ErrorReportStatus,
  insertErrorReport,
  listErrorReportsByUser,
  listErrorReports,
  markErrorReportReplyAsRead,
  updateErrorReportStatus,
} from "../db/queries/reportQueries"

const MAX_MESSAGE_LENGTH = 1000
const MAX_CATEGORY_LENGTH = 64
const MAX_ADMIN_REPLY_LENGTH = 2000

export const createErrorReportController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    if (!user?.id) {
      return res.status(401).json({ error: "No autenticado" })
    }

    const { category, message, page_path } = req.body || {}
    const trimmedCategory = typeof category === "string" ? category.trim() : ""
    const trimmedMessage = typeof message === "string" ? message.trim() : ""

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

    const created = await insertErrorReport({
      userId: user.id,
      category: trimmedCategory,
      message: trimmedMessage,
      pagePath: typeof page_path === "string" ? page_path.trim() : null,
      userAgent: typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : null,
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

    const updated = await updateErrorReportStatus(
      id,
      rawStatus as ErrorReportStatus,
      user.id,
      rawReply || null
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
