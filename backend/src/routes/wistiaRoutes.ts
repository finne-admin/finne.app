import express from "express";
import multer from "multer";
import fs from "fs";
import { requireAuth, requireOrganizationAdmin } from "../middlewares/verifyToken";

// ✅ Extiende el tipo de Request de Express para incluir "file"
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}

const router = express.Router();
// In Cloud Run, only /tmp is writable
try { fs.mkdirSync("/tmp/uploads", { recursive: true }); } catch {}
const upload = multer({ dest: "/tmp/uploads/" });

// Use Node 18+ built-in fetch and FormData to avoid ESM import issues
const fetch = globalThis.fetch as typeof globalThis.fetch;
const FormData = globalThis.FormData as typeof globalThis.FormData;

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
router.post("/upload", requireAuth, requireOrganizationAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Falta el archivo a subir" });

    const formData = new FormData();
    const fileBuffer = fs.readFileSync(req.file.path);
    const blob = new Blob([fileBuffer], { type: (req.file as any).mimetype || "application/octet-stream" });
    formData.append("file", blob, req.file.originalname);
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
