import { Request, Response } from "express"
import { getTagsByVideoHashesQuery } from "../db/queries/tagsQueries"

export const getTagsByVideoHashes = async (req: Request, res: Response) => {
  try {
    const { video_hashes } = req.body

    if (!Array.isArray(video_hashes) || video_hashes.length === 0) {
      return res.status(400).json({ error: "Debe incluir video_hashes" })
    }

    const tags = await getTagsByVideoHashesQuery(video_hashes)
    return res.json({ tags })
  } catch (err) {
    console.error("❌ Error en getTagsByVideoHashes:", err)
    return res.status(500).json({ error: "Error interno al obtener etiquetas" })
  }
}
