import { getPool } from "../../config/dbManager";

// Crear un refresh token (sesión nueva)
export const createRefreshToken = async (userId: string, token: string) => {
  const pool = await getPool();
  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token, revoked, created_at)
     VALUES ($1, $2, false, NOW())`,
    [userId, token]
  );
};

// Buscar token activo
export const findRefreshToken = async (token: string) => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `SELECT * FROM refresh_tokens WHERE token = $1 AND revoked = false`,
    [token]
  );
  return rows[0];
};

// Revocar token específico
export const revokeRefreshToken = async (token: string) => {
  const pool = await getPool();
  await pool.query(
    `UPDATE refresh_tokens SET revoked = true WHERE token = $1`,
    [token]
  );
};

// ✅ Nuevo: comprobar si un token está registrado y no revocado
export const isRefreshTokenValid = async (token: string): Promise<boolean> => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `SELECT revoked FROM refresh_tokens WHERE token = $1`,
    [token]
  );

  if (rows.length === 0) return false;
  if (rows[0].revoked === true) return false;
  return true;
};
