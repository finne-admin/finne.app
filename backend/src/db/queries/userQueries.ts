import { getPool } from "../../config/dbManager";

export const findUserByEmail = async (email: string) => {
  const pool = await getPool();
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0];
};

export const insertUser = async ({
  firstName,
  lastName,
  email,
  hashedPassword,
  dateOfBirth,
  sex,
  role,
}: any) => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `INSERT INTO users (email, first_name, last_name, date_of_birth, sex, role, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     RETURNING id, email, first_name, last_name, role`,
    [email, firstName, lastName, dateOfBirth, sex, role]
  );

  await pool.query(
    "INSERT INTO credentials (user_id, password_hash) VALUES ($1, $2)",
    [rows[0].id, hashedPassword]
  );

  return rows[0];
};

export const getUserWithPassword = async (email: string) => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `SELECT u.*, c.password_hash
     FROM users u
     JOIN credentials c ON c.user_id = u.id
     WHERE u.email = $1`,
    [email]
  );
  return rows[0];
};
