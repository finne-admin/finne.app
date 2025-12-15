import express from "express";
import { requireAuth } from "../middlewares/verifyToken";
import { getDailyQuotaByUserId } from "../db/queries/quotaQueries";

const router = express.Router();

// cupo diario
router.get("/daily", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const limit = 3;

    const { usedToday, remainingToday } = await getDailyQuotaByUserId(userId, limit);

    res.json({ usedToday, remainingToday });
  } catch (err) {
    console.error("Error al consultar cupo diario:", err);
    res.status(500).json({ error: "Error al consultar cupo diario" });
  }
});

export default router;
