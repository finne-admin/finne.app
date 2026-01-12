import { getPool } from "../../config/dbManager"

// Guarda o actualiza el token FCM para un usuario/dispositivo.
export const upsertFcmToken = async (userId: string, deviceId: string, token: string) => {
  const pool = await getPool()
  await pool.query(
    `
    INSERT INTO fcm_tokens (user_id, device_id, token, created_at)
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (user_id, device_id)
    DO UPDATE SET
      token = EXCLUDED.token,
      created_at = NOW()
    `,
    [userId, deviceId, token]
  )
}

// Elimina un token FCM segun user_id y filtros opcionales device/token.
export const deleteFcmTokenByFilter = async (
  userId: string,
  deviceId?: string | null,
  token?: string | null
) => {
  const pool = await getPool()
  const { rowCount } = await pool.query(
    `
    DELETE FROM fcm_tokens
    WHERE user_id = $1
      AND ($2::text IS NULL OR device_id = $2)
      AND ($3::text IS NULL OR token = $3)
    `,
    [userId, deviceId ?? null, token ?? null]
  )

  return rowCount
}
