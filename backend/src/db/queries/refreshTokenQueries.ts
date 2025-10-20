import { getPool } from "../../config/dbManager";

export const createRefreshToken = async (userId: string, token: string) => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2) RETURNING *`,
    [userId, token]
  );
  return rows[0];
};

export const findRefreshToken = async (token: string) => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `SELECT * FROM refresh_tokens WHERE token = $1 AND revoked = false`,
    [token]
  );
  return rows[0];
};

export const revokeRefreshToken = async (token: string) => {
  const pool = await getPool();
  await pool.query(`UPDATE refresh_tokens SET revoked = true WHERE token = $1`, [token]);
};
