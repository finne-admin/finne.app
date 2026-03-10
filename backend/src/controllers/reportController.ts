import { Request, Response } from "express"
import { insertErrorReport, listErrorReports } from "../db/queries/reportQueries"

const MAX_MESSAGE_LENGTH = 1000
const MAX_CATEGORY_LENGTH = 64

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
