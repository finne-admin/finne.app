import { getPool } from "../../config/dbManager"

export interface AppSettingRow<T = any> {
  value: T
}

export const getAppSetting = async <T = any>(key: string): Promise<T | null> => {
  const pool = await getPool()
  const { rows } = await pool.query<AppSettingRow<T>>(
    `SELECT value FROM app_settings WHERE key = $1`,
    [key]
  )
  return rows[0]?.value ?? null
}

export const upsertAppSetting = async <T = any>(key: string, value: T): Promise<void> => {
  const pool = await getPool()
  await pool.query(
    `
    INSERT INTO app_settings (key, value, updated_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value,
          updated_at = NOW()
    `,
    [key, value]
  )
}
