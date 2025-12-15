import { Request, Response } from "express"

export const getPublicTickerController = async (_req: Request, res: Response) => {
  try {
  } catch (error) {
    console.error("Error obteniendo ticker global:", error)
    return res.status(500).json({ error: "No se pudo cargar el ticker global" })
  }
}
