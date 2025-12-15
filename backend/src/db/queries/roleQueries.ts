import { getPool } from "../../config/dbManager";

export interface RoleRecord {
  id: string;
  name: string;
  description: string | null;
  scope: "global" | "organization" | string;
}

const roleCache = new Map<string, RoleRecord>();

export const findRoleByName = async (name: string): Promise<RoleRecord> => {
  const key = name.toLowerCase();
  if (roleCache.has(key)) {
    return roleCache.get(key)!;
  }

  const pool = await getPool();
  const { rows } = await pool.query<RoleRecord>(
    `SELECT id, name, description, scope FROM roles WHERE LOWER(name) = LOWER($1) LIMIT 1`,
    [name]
  );

  if (!rows[0]) {
    throw new Error(`Role "${name}" not found in database`);
  }

  roleCache.set(key, rows[0]);
  return rows[0];
};

export const findRoleById = async (id: string): Promise<RoleRecord | undefined> => {
  for (const cached of roleCache.values()) {
    if (cached.id === id) return cached;
  }

  const pool = await getPool();
  const { rows } = await pool.query<RoleRecord>(
    `SELECT id, name, description, scope FROM roles WHERE id = $1 LIMIT 1`,
    [id]
  );

  if (!rows[0]) return undefined;

  roleCache.set(rows[0].name.toLowerCase(), rows[0]);
  return rows[0];
};

export const listRoles = async (): Promise<RoleRecord[]> => {
  const pool = await getPool();
  const { rows } = await pool.query<RoleRecord>(
    `SELECT id, name, description, scope FROM roles ORDER BY name`
  );
  rows.forEach((role) => {
    roleCache.set(role.name.toLowerCase(), role);
  });
  return rows;
};
