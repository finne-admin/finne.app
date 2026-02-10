import { getPool } from "../../config/dbManager"

export type NotificationPreferencesRow = {
  user_id: string
  active: boolean
  times: string[]
  allow_weekend_notifications: boolean
  updated_at?: Date | null
  created_at?: Date | null
}

export const findNotificationPreferences = async (
  userId: string
): Promise<NotificationPreferencesRow | null> => {
  const pool = await getPool()
  const { rows } = await pool.query<NotificationPreferencesRow>(
    `SELECT * FROM notification_preferences WHERE user_id = $1`,
    [userId]
  )
  return rows[0] ?? null
}

export const getOrganizationNotificationDefaults = async (organizationId: string) => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `
    SELECT
      default_notification_times,
      default_notification_times_by_day,
      default_notification_active,
      default_allow_weekend_notifications
    FROM organizations
    WHERE id = $1
    `,
    [organizationId]
  )
  return rows[0] ?? null
}

export const insertNotificationPreferences = async (
  userId: string,
  active: boolean,
  times: string[],
  allowWeekend: boolean
): Promise<NotificationPreferencesRow> => {
  const pool = await getPool()
  const { rows } = await pool.query<NotificationPreferencesRow>(
    `
    INSERT INTO notification_preferences (user_id, active, times, allow_weekend_notifications)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [userId, active, times, allowWeekend]
  )
  return rows[0]
}

export const upsertNotificationPreferencesQuery = async (
  userId: string,
  active: boolean,
  times: string[],
  allowWeekend: boolean
): Promise<NotificationPreferencesRow> => {
  const pool = await getPool()
  const { rows } = await pool.query<NotificationPreferencesRow>(
    `
    INSERT INTO notification_preferences (user_id, active, times, allow_weekend_notifications, updated_at)
    VALUES ($1, $2, $3::text[], $4, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET
      active = EXCLUDED.active,
      times = EXCLUDED.times,
      allow_weekend_notifications = EXCLUDED.allow_weekend_notifications,
      updated_at = NOW()
    RETURNING *
    `,
    [userId, active, times, allowWeekend]
  )
  return rows[0]
}

export const deleteNotificationPreferencesByUser = async (userId: string) => {
  const pool = await getPool()
  await pool.query(`DELETE FROM notification_preferences WHERE user_id = $1`, [userId])
}
