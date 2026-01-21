import { getPool } from "../../config/dbManager"

export interface NotificationPreferenceRow {
  user_id: string
  times: string[]
  allow_weekend_notifications: boolean
}

export interface TipNotificationTargetRow {
  user_id: string
  times: string[]
  allow_weekend_notifications: boolean
}

export async function fetchActiveNotificationPreferences(): Promise<NotificationPreferenceRow[]> {
  const pool = await getPool()
  const { rows } = await pool.query<NotificationPreferenceRow>(
    `
      SELECT user_id, times, allow_weekend_notifications
      FROM notification_preferences
      WHERE active = TRUE
    `
  )
  return rows || []
}

export async function fetchTipNotificationTargets(): Promise<TipNotificationTargetRow[]> {
  const pool = await getPool()
  const { rows } = await pool.query<TipNotificationTargetRow>(
    `
      SELECT
        np.user_id,
        o.default_notification_times AS times,
        COALESCE(o.default_allow_weekend_notifications, np.allow_weekend_notifications) AS allow_weekend_notifications
      FROM notification_preferences np
      JOIN user_membership um ON um.user_id = np.user_id
      JOIN organizations o ON o.id = um.organization_id
      WHERE np.active = TRUE
        AND (o.default_notification_active IS DISTINCT FROM FALSE)
    `
  )
  return rows || []
}

export async function fetchTokensForUsers(
  userIds: string[]
): Promise<Record<string, string[]>> {
  if (!userIds.length) return {}

  const pool = await getPool()
  const { rows } = await pool.query<{ user_id: string; token: string }>(
    `
      SELECT user_id, token
      FROM fcm_tokens
      WHERE user_id = ANY($1::uuid[])
    `,
    [userIds]
  )

  return rows.reduce<Record<string, string[]>>((acc, row) => {
    if (!acc[row.user_id]) {
      acc[row.user_id] = []
    }
    acc[row.user_id].push(row.token)
    return acc
  }, {})
}

export async function deleteTokens(tokens: string[]): Promise<void> {
  if (!tokens.length) return

  const pool = await getPool()
  await pool.query(`DELETE FROM fcm_tokens WHERE token = ANY($1::text[])`, [tokens])
}
