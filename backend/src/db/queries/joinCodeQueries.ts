import type { Pool, PoolClient } from "pg";
import { getPool } from "../../config/dbManager";

type Queryable = Pool | PoolClient;

const resolveClient = async (client?: Queryable): Promise<Queryable> =>
  client ?? (await getPool());

export interface JoinCodeRecord {
  id: string;
  code: string;
  organization_id: string;
  department_id: string;
  organization_name: string;
  organization_slug: string;
  department_name: string;
  expires_at: Date | null;
  max_uses: number | null;
  used_count: number;
  auto_approve: boolean;
  created_at: Date;
  updated_at: Date | null;
}

interface ResolveOptions {
  client?: Queryable;
  forUpdate?: boolean;
}

export const findJoinCodeByCode = async (
  code: string,
  options: ResolveOptions = {}
): Promise<JoinCodeRecord | undefined> => {
  const db = await resolveClient(options.client);
  const suffix = options.forUpdate ? "FOR UPDATE" : "";
  const { rows } = await db.query<JoinCodeRecord>(
    `
    SELECT
      jc.*,
      o.name AS organization_name,
      o.slug AS organization_slug,
      d.name AS department_name
    FROM organization_join_codes jc
    JOIN organizations o ON o.id = jc.organization_id
    JOIN departments d ON d.id = jc.department_id
    WHERE UPPER(jc.code) = UPPER($1)
    ${suffix}
    `,
    [code]
  );
  return rows[0];
};

export const incrementJoinCodeUsage = async (id: string, client?: Queryable) => {
  const db = await resolveClient(client);
  await db.query(
    `UPDATE organization_join_codes SET used_count = used_count + 1, updated_at = NOW() WHERE id = $1`,
    [id]
  );
};

interface CreateJoinCodeParams {
  organizationId: string;
  departmentId: string;
  code: string;
  autoApprove: boolean;
  maxUses?: number | null;
  expiresAt?: Date | null;
  createdBy?: string | null;
}

export const createJoinCode = async (
  params: CreateJoinCodeParams,
  client?: Queryable
) => {
  const db = await resolveClient(client);
  const { rows } = await db.query(
    `
    INSERT INTO organization_join_codes
      (organization_id, department_id, code, auto_approve, max_uses, expires_at, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [
      params.organizationId,
      params.departmentId,
      params.code,
      params.autoApprove,
      params.maxUses ?? null,
      params.expiresAt ?? null,
      params.createdBy ?? null,
    ]
  );
  return rows[0];
};

export const deleteJoinCodeById = async (id: string) => {
  const db = await resolveClient();
  await db.query(`DELETE FROM organization_join_codes WHERE id = $1`, [id]);
};

export const listJoinCodes = async (): Promise<JoinCodeRecord[]> => {
  const db = await resolveClient();
  const { rows } = await db.query<JoinCodeRecord>(
    `
    SELECT
      jc.*,
      o.name AS organization_name,
      o.slug AS organization_slug,
      d.name AS department_name
    FROM organization_join_codes jc
    JOIN organizations o ON o.id = jc.organization_id
    JOIN departments d ON d.id = jc.department_id
    ORDER BY jc.created_at DESC
    `
  );
  return rows;
};
