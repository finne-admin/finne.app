import { getPool } from "../../config/dbManager";

interface FetchUserFilters {
  organizationId?: string;
  departmentId?: string;
}

export const fetchAdminUsers = async (filters: FetchUserFilters = {}) => {
  const pool = await getPool();
  const conditions: string[] = [];
  const params: any[] = [];

  if (filters.organizationId) {
    params.push(filters.organizationId);
    conditions.push(`um.organization_id = $${params.length}`);
  }

  if (filters.departmentId) {
    params.push(filters.departmentId);
    conditions.push(`um.department_id = $${params.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const { rows } = await pool.query(
    `
    SELECT
      u.id,
      u.email,
      u.first_name,
      u.last_name,
      u.role_id,
      r.name AS role_name,
      r.scope AS role_scope,
      u.created_at,
      u.account_status,
      u.registration_requested_at,
      u.approved_at,
      u.approved_by,
      um.organization_id,
      um.department_id,
      o.name AS organization_name,
      d.name AS department_name,
      COALESCE(MAX(ap.created_at), u.created_at) AS last_active,
      CASE
        WHEN MAX(ap.created_at) IS NULL THEN FALSE
        WHEN MAX(ap.created_at) >= NOW() - INTERVAL '30 days' THEN TRUE
        ELSE FALSE
      END AS is_active
    FROM users u
    LEFT JOIN roles r ON r.id = u.role_id
    LEFT JOIN user_membership um ON um.user_id = u.id
    LEFT JOIN organizations o ON o.id = um.organization_id
    LEFT JOIN departments d ON d.id = um.department_id
    LEFT JOIN active_pauses ap ON ap.user_id = u.id
    ${whereClause}
    GROUP BY
      u.id,
      u.email,
      u.first_name,
      u.last_name,
      u.role_id,
      r.name,
      r.scope,
      u.created_at,
      u.account_status,
      u.registration_requested_at,
      u.approved_at,
      u.approved_by,
      um.organization_id,
      um.department_id,
      o.name,
      d.name
    ORDER BY u.created_at DESC
    `,
    params
  );
  return rows;
};

interface UpdateUserParams {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role_id?: string;
}

export const updateAdminUser = async ({
  id,
  first_name,
  last_name,
  email,
  role_id,
}: UpdateUserParams) => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `
    UPDATE users
    SET
      first_name = COALESCE($2, first_name),
      last_name = COALESCE($3, last_name),
      email = COALESCE($4, email),
      role_id = COALESCE($5, role_id),
      updated_at = NOW()
    WHERE id = $1
    RETURNING id, email, first_name, last_name, role_id, created_at
    `,
    [id, first_name ?? null, last_name ?? null, email ?? null, role_id ?? null]
  );

  return rows[0];
};

export const deleteAdminUser = async (id: string) => {
  const pool = await getPool();
  const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING id`, [id]);
  return result.rowCount ?? 0;
};

export const fetchExerciseSatisfactionRecords = async (limit: number) => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `
    SELECT
      id,
      user_id,
      video_hash_ids,
      tags,
      satisfaction_level,
      created_at
    FROM exercise_satisfaction
    ORDER BY created_at DESC
    LIMIT $1
    `,
    [limit]
  );
  return rows;
};
