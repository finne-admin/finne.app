import type { Pool, PoolClient } from "pg";
import { getPool } from "../../config/dbManager";
import { uuidv7 } from "uuidv7";

export type AccountStatus = "pending" | "active" | "rejected";

type Queryable = Pool | PoolClient;

const resolveClient = async (client?: Queryable): Promise<Queryable> => {
  if (client) return client;
  return getPool();
};

interface InsertUserParams {
  firstName: string;
  lastName: string;
  email: string;
  hashedPassword: string;
  dateOfBirth: string | null;
  sex: string | null;
  roleId: string;
  accountStatus?: AccountStatus;
}

const baseUserSelect = `
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  u.role_id,
  r.name AS role_name,
  r.scope AS role_scope,
  u.date_of_birth,
  u.sex,
  u.created_at,
  u.updated_at,
  u.account_status,
  u.approved_at,
  u.approved_by,
  u.registration_requested_at
`;
const baseUserSelectWithoutAlias = baseUserSelect.replace(/u\./g, "");

export const findUserByEmail = async (email: string) => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `
    SELECT ${baseUserSelect}
    FROM users u
    LEFT JOIN roles r ON r.id = u.role_id
    WHERE u.email = $1
    `,
    [email]
  );
  return rows[0];
};

export const insertUser = async (
  {
    firstName,
    lastName,
    email,
    hashedPassword,
    dateOfBirth,
    sex,
    roleId,
    accountStatus = "pending",
  }: InsertUserParams,
  client?: Queryable
) => {
  const db = await resolveClient(client);
  const id = uuidv7();
  await db.query(
    `INSERT INTO users (id, email, first_name, last_name, date_of_birth, sex, role_id, account_status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
    [id, email, firstName, lastName, dateOfBirth, sex, roleId, accountStatus]
  );

  await db.query(
    "INSERT INTO credentials (user_id, password_hash) VALUES ($1, $2)",
    [id, hashedPassword]
  );

  return findUserById(id, db);
};

export const getUserWithPassword = async (email: string) => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `SELECT ${baseUserSelect}, c.password_hash
     FROM users u
     JOIN credentials c ON c.user_id = u.id
     LEFT JOIN roles r ON r.id = u.role_id
     WHERE u.email = $1`,
    [email]
  );
  return rows[0];
};

export const updateUserPasswordById = async (userId: string, hashedPassword: string) => {
  const pool = await getPool();
  await pool.query(
    `UPDATE credentials SET password_hash = $2 WHERE user_id = $1`,
    [userId, hashedPassword]
  );
};

export const findUserById = async (userId: string, client?: Queryable) => {
  const db = await resolveClient(client);
  const { rows } = await db.query(
    `
    SELECT ${baseUserSelect}
    FROM users u
    LEFT JOIN roles r ON r.id = u.role_id
    WHERE u.id = $1
    `,
    [userId]
  );
  return rows[0];
};

export const approveUserAccount = async (userId: string, adminId: string) => {
  const pool = await getPool();
  const result = await pool.query(
    `
    UPDATE users
    SET account_status = 'active',
        approved_at = NOW(),
        approved_by = $2,
        updated_at = NOW()
    WHERE id = $1
    `,
    [userId, adminId]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return findUserById(userId, pool);
};

export const rejectUserAccount = async (userId: string, adminId: string) => {
  const pool = await getPool();
  const result = await pool.query(
    `
    UPDATE users
    SET account_status = 'rejected',
        approved_at = NOW(),
        approved_by = $2,
        updated_at = NOW()
    WHERE id = $1
    `,
    [userId, adminId]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return findUserById(userId, pool);
};
