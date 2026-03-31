import { Request, Response } from "express"
import { checkAndGrantAchievements } from "../services/achievementService"

// Este endpoint actua como punto de entrada HTTP para el sistema de logros.
// El cliente envia un tipo de evento de negocio y, opcionalmente, datos extra
// para que el servicio decida si corresponde desbloquear algun logro.
export const checkAchievementsController = async (req: Request, res: Response) => {
  // Todas las evaluaciones de logros se hacen sobre el usuario autenticado.
  // Nunca se confia en un userId enviado por el cliente.
  const user = (req as any).user
  if (!user?.id) {
    return res.status(401).json({ error: "No autenticado" })
  }

  // eventType identifica que accion ha ocurrido en la app
  // y payload permite pasar contexto adicional al servicio.
  const { eventType, payload } = req.body || {}
  if (!eventType) {
    return res.status(400).json({ error: "Falta eventType" })
  }

  try {
    // Toda la logica real vive en achievementService:
    // aqui solo validamos la entrada y devolvemos la respuesta HTTP.
    const unlocked = await checkAndGrantAchievements(user.id, String(eventType), payload)
    return res.json({ unlocked })
  } catch (error) {
    console.error("Error comprobando logros:", error)
    return res.status(500).json({ error: "Error al evaluar logros" })
  }
}
