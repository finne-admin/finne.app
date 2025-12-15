import { getPool } from "../../config/dbManager";

export const ensurePasswordResetTable = async () => {
  const pool = await getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id BIGSERIAL PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      used BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
  `);
};

export const createPasswordResetToken = async (
  userId: string,
  token: string,
  expiresAt: Date
) => {
  const pool = await getPool();
  await pool.query(
    `INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
    [userId, token, expiresAt]
  );
};

export const findValidPasswordResetToken = async (token: string) => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `SELECT user_id, token, expires_at, used
     FROM password_reset_tokens
     WHERE token = $1 AND used = false AND expires_at > NOW()`,
    [token]
  );
  return rows[0] as { user_id: string; token: string; expires_at: string; used: boolean } | undefined;
};

export const markPasswordResetTokenUsed = async (token: string) => {
  const pool = await getPool();
  await pool.query(
    `UPDATE password_reset_tokens SET used = true WHERE token = $1`,
    [token]
  );
};
