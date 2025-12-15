import { Request, Response } from "express"
import { getPool } from "../config/dbManager"
import { getMembershipForUser } from "../db/queries/userMembershipQueries"

const toTimesArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return (value as unknown[]).map((item) => String(item));
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      return trimmed
        .slice(1, -1)
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
    }
    return [trimmed];
  }
  return [];
};

const FALLBACK_TIMES = ["10:30", "12:00", "15:45"];

/**
 * 🟢 Obtener preferencias de notificaciones
 */
export const getNotificationPreferences = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user

    if (!user?.id) {
      return res.status(401).json({ error: "Usuario no autenticado" })
    }

    const pool = await getPool()

    // Buscar preferencias del usuario
    const { rows } = await pool.query(
      `SELECT * FROM notification_preferences WHERE user_id = $1`,
      [user.id]
    )

    if (rows.length > 0) {
      return res.json(rows[0])
    }

    const membership = await getMembershipForUser(user.id)
    let defaultTimes = [...FALLBACK_TIMES]
    let defaultActive = true
    let defaultAllowWeekend = true

    if (membership?.organization_id) {
      const { rows: orgRows } = await pool.query(
        `
        SELECT
          default_notification_times,
          default_notification_active,
          default_allow_weekend_notifications
        FROM organizations
        WHERE id = $1
      `,
        [membership.organization_id]
      )

      if (orgRows[0]) {
        const orgTimes = toTimesArray(orgRows[0].default_notification_times)
        if (orgTimes.length) {
          defaultTimes = orgTimes
        }
        if (typeof orgRows[0].default_notification_active === "boolean") {
          defaultActive = orgRows[0].default_notification_active
        }
        if (typeof orgRows[0].default_allow_weekend_notifications === "boolean") {
          defaultAllowWeekend = orgRows[0].default_allow_weekend_notifications
        }
      }
    }

    // Crear registro por defecto
    const { rows: inserted } = await pool.query(
      `INSERT INTO notification_preferences (user_id, active, times, allow_weekend_notifications)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user.id, defaultActive, defaultTimes, defaultAllowWeekend]
    )

    res.json(inserted[0])
  } catch (err) {
    console.error("❌ Error obteniendo preferencias:", err)
    res.status(500).json({ error: "Error al obtener preferencias" })
  }
}

/**
 * 🟢 Insertar o actualizar preferencias (autenticadas)
 */
export const upsertNotificationPreferences = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    if (!user?.id) {
      return res.status(401).json({ error: "Usuario no autenticado" })
    }

    const { active, times, allow_weekend_notifications } = req.body

    if (!Array.isArray(times)) {
      return res.status(400).json({ error: "El campo 'times' debe ser un array" })
    }

    const pool = await getPool()
    const formattedTimes = `{${times.join(",")}}` // 👈 convierte array JS → text[]

    const query = `
      INSERT INTO notification_preferences (user_id, active, times, allow_weekend_notifications, updated_at)
      VALUES ($1, $2, $3::text[], COALESCE($4, TRUE), NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET 
        active = EXCLUDED.active,
        times = EXCLUDED.times,
        allow_weekend_notifications = EXCLUDED.allow_weekend_notifications,
        updated_at = NOW()
      RETURNING *
    `

    const { rows } = await pool.query(query, [
      user.id,
      active ?? true,
      formattedTimes,
      allow_weekend_notifications ?? true,
    ])

    return res.json({ success: true, preferences: rows[0] })
  } catch (err) {
    console.error("❌ Error guardando preferencias:", err)
    return res.status(500).json({ error: "Error interno al guardar preferencias." })
  }
}

/**
 * 🔴 Eliminar preferencias (autenticadas)
 */
export const deleteNotificationPreferences = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    if (!user?.id) {
      return res.status(401).json({ error: "Usuario no autenticado" })
    }

    const pool = await getPool()
    await pool.query(`DELETE FROM notification_preferences WHERE user_id = $1`, [user.id])

    return res.json({ success: true })
  } catch (err) {
    console.error("❌ Error eliminando preferencias:", err)
    return res.status(500).json({ error: "Error interno al eliminar preferencias." })
  }
}
