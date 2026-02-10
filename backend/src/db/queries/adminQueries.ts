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
    `
    SELECT
      id,
      name,
      slug,
      max_daily_active_pauses,
      season_deadline,
      season_timezone
    FROM organizations
    WHERE id = $1
    `,
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
    `
    SELECT
      id,
      name,
      slug,
      max_daily_active_pauses,
      season_deadline,
      season_timezone
    FROM organizations
    ORDER BY name
    `
  );
  const { rows: depts } = await pool.query(
    `SELECT id, name, organization_id FROM departments ORDER BY name`
  );
  return { orgs, depts };
};

export const listOrganizationSeasonTimers = async () => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `
    SELECT
      id,
      name,
      slug,
      season_deadline,
      season_timezone
    FROM organizations
    ORDER BY name
    `
  );
  return rows;
};

export const updateOrganizationSeasonTimerById = async (
  organizationId: string,
  seasonDeadline: string | null,
  seasonTimezone: string | null
) => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `
    UPDATE organizations
    SET
      season_deadline = $2,
      season_timezone = $3
    WHERE id = $1
    RETURNING id, name, slug, season_deadline, season_timezone
    `,
    [organizationId, seasonDeadline, seasonTimezone]
  );
  return rows[0];
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
      default_notification_times_by_day,
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
  timesByDay: Record<string, string[]> | null,
  hasTimesByDay: boolean,
  active?: boolean,
  allowWeekend?: boolean
) => {
  const pool = await getPool();
  const { rows } = await pool.query(
    `
    UPDATE organizations
    SET
      default_notification_times = $2::text[],
      default_notification_times_by_day = CASE
        WHEN $4 THEN $3::jsonb
        ELSE default_notification_times_by_day
      END,
      default_notification_active = COALESCE($5, default_notification_active),
      default_allow_weekend_notifications = COALESCE($6, default_allow_weekend_notifications)
    WHERE id = $1
    RETURNING
      id,
      name,
      slug,
      default_notification_times,
      default_notification_times_by_day,
      default_notification_active,
      default_allow_weekend_notifications
    `,
    [organizationId, times, timesByDay, hasTimesByDay, active, allowWeekend]
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

export type ResetScopeParams = {
  organizationId: string;
  departmentId?: string | null;
  resetGeneralAchievements?: boolean;
  resetWeeklyAchievements?: boolean;
  resetActivePauses?: boolean;
  resetRanking?: boolean;
};

export type ResetScopeResult = {
  affectedUsers: number;
  achievementsDeleted: number;
  weeklyDeleted: number;
  activePausesDeleted: number;
  satisfactionDeleted: number;
  sessionParticipantsDeleted: number;
  rankingUsersUpdated: number;
};

export const resetOrganizationScopeData = async (
  params: ResetScopeParams
): Promise<ResetScopeResult> => {
  const pool = await getPool();
  const client = await pool.connect();
  const departmentId = params.departmentId ?? null;
  const baseParams = [params.organizationId, departmentId];

  const result: ResetScopeResult = {
    affectedUsers: 0,
    achievementsDeleted: 0,
    weeklyDeleted: 0,
    activePausesDeleted: 0,
    satisfactionDeleted: 0,
    sessionParticipantsDeleted: 0,
    rankingUsersUpdated: 0,
  };

  try {
    await client.query("BEGIN");

    const { rows: userRows } = await client.query(
      `
      SELECT user_id
      FROM user_membership
      WHERE organization_id = $1
        AND ($2::uuid IS NULL OR department_id = $2)
      `,
      baseParams
    );

    result.affectedUsers = userRows.length;

    if (params.resetGeneralAchievements) {
      const achievements = await client.query(
        `
        DELETE FROM user_achievements ua
        USING achievements_catalog ac, user_membership um
        WHERE ua.achievement_id = ac.id
          AND ac.condition_type <> 'nivel_usuario'
          AND ua.user_id = um.user_id
          AND um.organization_id = $1
          AND ($2::uuid IS NULL OR um.department_id = $2)
        `,
        baseParams
      );
      result.achievementsDeleted = achievements.rowCount ?? 0;
    }

    if (params.resetWeeklyAchievements) {
      const weekly = await client.query(
        `
        DELETE FROM user_weekly_challenges uwc
        USING user_membership um
        WHERE uwc.user_id = um.user_id
          AND um.organization_id = $1
          AND ($2::uuid IS NULL OR um.department_id = $2)
        `,
        baseParams
      );
      result.weeklyDeleted = weekly.rowCount ?? 0;
    }

    if (params.resetActivePauses) {
      const sessions = await client.query(
        `
        DELETE FROM pause_session_participants psp
        USING active_pauses ap, user_membership um
        WHERE psp.active_pause_id = ap.id
          AND ap.user_id = um.user_id
          AND um.organization_id = $1
          AND ($2::uuid IS NULL OR um.department_id = $2)
        `,
        baseParams
      );
      result.sessionParticipantsDeleted = sessions.rowCount ?? 0;

      const satisfaction = await client.query(
        `
        DELETE FROM exercise_satisfaction es
        USING user_membership um
        WHERE es.user_id = um.user_id
          AND um.organization_id = $1
          AND ($2::uuid IS NULL OR um.department_id = $2)
        `,
        baseParams
      );
      result.satisfactionDeleted = satisfaction.rowCount ?? 0;

      const pauses = await client.query(
        `
        DELETE FROM active_pauses ap
        USING user_membership um
        WHERE ap.user_id = um.user_id
          AND um.organization_id = $1
          AND ($2::uuid IS NULL OR um.department_id = $2)
        `,
        baseParams
      );
      result.activePausesDeleted = pauses.rowCount ?? 0;
    }

    if (params.resetRanking) {
      const ranking = await client.query(
        `
        UPDATE users u
        SET periodical_exp = 0
        FROM user_membership um
        WHERE u.id = um.user_id
          AND um.organization_id = $1
          AND ($2::uuid IS NULL OR um.department_id = $2)
        `,
        baseParams
      );
      result.rankingUsersUpdated = ranking.rowCount ?? 0;
    }

    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
