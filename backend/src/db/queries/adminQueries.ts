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

export const findOrganizationById = async (organizationId: string) => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `SELECT id, name, slug, max_daily_active_pauses FROM organizations WHERE id = $1`,
    [organizationId]
  );
  return rows[0];
};

export const createOrganization = async (
  name: string,
  slug: string,
  maxDailyActivePauses?: number
) => {
  const pool = await getPool();
  if (typeof maxDailyActivePauses === "number") {
    const { rows } = await pool.query(
      `
      INSERT INTO organizations (name, slug, max_daily_active_pauses)
      VALUES ($1, $2, $3)
      RETURNING id, name, slug, max_daily_active_pauses
      `,
      [name, slug, maxDailyActivePauses]
    );
    return rows[0];
  }

  const { rows } = await pool.query(
    `
    INSERT INTO organizations (name, slug)
    VALUES ($1, $2)
    RETURNING id, name, slug, max_daily_active_pauses
    `,
    [name, slug]
  );
  return rows[0];
};

export const findDepartmentById = async (departmentId: string) => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `SELECT id, name, organization_id FROM departments WHERE id = $1`,
    [departmentId]
  );
  return rows[0];
};

export const createDepartment = async (organizationId: string, name: string) => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `
    INSERT INTO departments (name, organization_id)
    VALUES ($1, $2)
    RETURNING id, name, organization_id
    `,
    [name, organizationId]
  );
  return rows[0];
};

export const updateUserRoleById = async (userId: string, roleId: string) => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `
    UPDATE users
    SET role_id = $2,
        updated_at = NOW()
    WHERE id = $1
    RETURNING id, email, first_name, last_name, role_id
    `,
    [userId, roleId]
  );
  return rows[0];
};

export const fetchOrganizationStructure = async () => {
  const pool = await getPool();
  const { rows: orgs } = await pool.query(
    `SELECT id, name, slug, max_daily_active_pauses FROM organizations ORDER BY name`
  );
  const { rows: depts } = await pool.query(
    `SELECT id, name, organization_id FROM departments ORDER BY name`
  );
  return { orgs, depts };
};

export const listOrganizationNotificationDefaults = async () => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `
    SELECT
      id,
      name,
      slug,
      default_notification_times,
      default_notification_active,
      default_allow_weekend_notifications
    FROM organizations
    ORDER BY name
    `
  );

  return rows;
};

export const updateOrganizationNotificationDefaultsById = async (
  organizationId: string,
  times: string[],
  active?: boolean,
  allowWeekend?: boolean
) => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `
    UPDATE organizations
    SET
      default_notification_times = $2::text[],
      default_notification_active = COALESCE($3, default_notification_active),
      default_allow_weekend_notifications = COALESCE($4, default_allow_weekend_notifications)
    WHERE id = $1
    RETURNING
      id,
      name,
      slug,
      default_notification_times,
      default_notification_active,
      default_allow_weekend_notifications
    `,
    [organizationId, times, active, allowWeekend]
  );

  return rows[0];
};

export const updateOrganizationDailyLimitById = async (
  organizationId: string,
  maxDailyActivePauses: number
) => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `
    UPDATE organizations
    SET max_daily_active_pauses = $2
    WHERE id = $1
    RETURNING id, name, slug, max_daily_active_pauses
    `,
    [organizationId, maxDailyActivePauses]
  );

  return rows[0];
};
