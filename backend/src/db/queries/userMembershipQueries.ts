import type { Pool, PoolClient } from "pg";
import { getPool } from "../../config/dbManager";

type Queryable = Pool | PoolClient;

const resolveClient = async (client?: Queryable): Promise<Queryable> =>
  client ?? (await getPool());

export const upsertUserMembership = async (
  userId: string,
  organizationId: string,
  departmentId: string,
  client?: Queryable
) => {
  const db = await resolveClient(client);
  await db.query(
    `
    INSERT INTO user_membership (user_id, organization_id, department_id, created_at)
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET
      organization_id = EXCLUDED.organization_id,
      department_id = EXCLUDED.department_id
    `,
    [userId, organizationId, departmentId]
  );
};

export interface UserMembershipWithNames {
  organization_id: string | null;
  department_id: string | null;
  organization_name: string | null;
  department_name: string | null;
}

export const getMembershipForUser = async (
  userId: string
): Promise<UserMembershipWithNames | undefined> => {
  const db = await resolveClient();
  const { rows } = await db.query<UserMembershipWithNames>(
    `
    SELECT
      um.organization_id,
      um.department_id,
      o.name AS organization_name,
      d.name AS department_name
    FROM user_membership um
    LEFT JOIN organizations o ON o.id = um.organization_id
    LEFT JOIN departments d ON d.id = um.department_id
    WHERE um.user_id = $1
    `,
    [userId]
  );
  return rows[0];
};

export const getDailyActivePauseLimitForUser = async (userId: string, fallback = 3) => {
  const db = await resolveClient();
  const { rows } = await db.query<{ max_daily_active_pauses: number | null }>(
    `
    SELECT o.max_daily_active_pauses
    FROM user_membership um
    LEFT JOIN organizations o ON o.id = um.organization_id
    WHERE um.user_id = $1
    `,
    [userId]
  );

  const value = rows[0]?.max_daily_active_pauses;
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
};
