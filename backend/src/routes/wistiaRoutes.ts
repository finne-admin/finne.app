import express from "express";
import fetch from "node-fetch";
import multer from "multer";
import fs from "fs";
import FormData from "form-data";
import { requireAuth, requireAdmin } from "../middlewares/verifyToken";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const WISTIA_API_TOKEN = process.env.WISTIA_API_TOKEN!;
const WISTIA_PROJECT_ID = process.env.WISTIA_PROJECT_ID!;

// 📹 Obtener vídeos (solo usuarios logueados)
router.get("/videos", requireAuth, async (req, res) => {
  try {
    const tags = Array.isArray(req.query.tags)
      ? (req.query.tags as string[])
      : req.query.tags
      ? [req.query.tags as string]
      : [];

    let wistiaUrl = `https://api.wistia.com/v1/medias.json?project_id=${WISTIA_PROJECT_ID}`;
    if (tags.length > 0) {
      tags.forEach((tag) => (wistiaUrl += `&tags=${encodeURIComponent(tag)}`));
    }

    const response = await fetch(wistiaUrl, {
      headers: { Authorization: `Bearer ${WISTIA_API_TOKEN}` },
    });

    if (!response.ok) throw new Error(`Wistia API error: ${response.statusText}`);
    const data = await response.json();

    res.json(data);
  } catch (err: any) {
    console.error("❌ Error al obtener vídeos de Wistia:", err);
    res.status(500).json({ error: "Error al obtener vídeos de Wistia" });
  }
});

// 📤 Subir vídeos (solo admin)
router.post("/upload", requireAuth, requireAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Falta el archivo a subir" });

    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));
    formData.append("project_id", WISTIA_PROJECT_ID);
    formData.append("name", req.file.originalname);

    const response = await fetch("https://upload.wistia.com", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WISTIA_API_TOKEN}`,
      },
      body: formData as any,
    });

    const data = await response.json();
    fs.unlinkSync(req.file.path);

    // Type assertion to ensure data is an object with optional error property
    const dataObj = data as { error?: string };

    if (!response.ok) throw new Error(dataObj.error || "Error al subir vídeo");

    res.json({
      success: true,
      message: "Vídeo subido correctamente",
      data,
    });
  } catch (err: any) {
    console.error("❌ Error al subir vídeo a Wistia:", err);
    res.status(500).json({ error: "Error al subir vídeo a Wistia" });
  }
});

export default router;
