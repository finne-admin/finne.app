import { Request, Response } from "express";
import { checkAndGrantAchievements } from "../services/achievementService";

// Controlador HTTP: recibe eventos de usuario y devuelve los logros desbloqueados tras evaluarlos.
export const checkAchievementsController = async (req: Request, res: Response) => {
  // El middleware de autenticacion debe inyectar user en la request.
  const user = (req as any).user;
  if (!user?.id) {
    return res.status(401).json({ error: "No autenticado" });
  }

  // El cuerpo debe incluir el tipo de evento y su payload opcional.
  const { eventType, payload } = req.body || {};
  if (!eventType) {
    return res.status(400).json({ error: "Falta eventType" });
  }

  try {
    // Evalua el evento contra las reglas de logros y retorna los desbloqueados.
    const unlocked = await checkAndGrantAchievements(user.id, String(eventType), payload);
    return res.json({ unlocked });
  } catch (error) {
    console.error("Error comprobando logros:", error);
    return res.status(500).json({ error: "Error al evaluar logros" });
  }
};
