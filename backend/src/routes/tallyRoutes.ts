import express from "express";
import { requireAuth, requireOrganizationAdmin } from "../middlewares/verifyToken";

const router = express.Router();
// Use Node 18+ built-in fetch to avoid ESM import issues
const fetch = globalThis.fetch as typeof globalThis.fetch;
const TALLY_API_KEY = process.env.TALLY_API_KEY!;
const TALLY_FORM_ID = process.env.TALLY_FORM_ID!;

// 📄 Solo administradores pueden leer respuestas
router.get("/responses", requireAuth, requireOrganizationAdmin, async (_req, res) => {
  try {
    const response = await fetch(`https://api.tally.so/v1/forms/${TALLY_FORM_ID}/responses`, {
      headers: {
        Authorization: `Bearer ${TALLY_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`Tally API error: ${response.statusText}`);
    const data = await response.json();

    res.json(data);
  } catch (err: any) {
    console.error("❌ Error al obtener respuestas de Tally:", err);
    res.status(500).json({ error: "Error al obtener datos de Tally" });
  }
});

// 📬 Webhook público (Tally no puede enviar token)
router.post("/webhook", express.json(), async (req, res) => {
  try {
    console.log("📨 Webhook Tally recibido:", req.body);
    res.status(200).json({ success: true, message: "Webhook recibido correctamente" });
  } catch (err) {
    console.error("❌ Error al procesar webhook de Tally:", err);
    res.status(500).json({ error: "Error procesando webhook" });
  }
});

export default router;
