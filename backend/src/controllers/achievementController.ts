import { Request, Response } from "express";
import { checkAndGrantAchievements } from "../services/achievementService";

export const checkAchievementsController = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user?.id) {
    return res.status(401).json({ error: "No autenticado" });
  }

  const { eventType, payload } = req.body || {};
  if (!eventType) {
    return res.status(400).json({ error: "Falta eventType" });
  }

  try {
    const unlocked = await checkAndGrantAchievements(user.id, String(eventType), payload);
    return res.json({ unlocked });
  } catch (error) {
    console.error("Error comprobando logros:", error);
    return res.status(500).json({ error: "Error al evaluar logros" });
  }
};
