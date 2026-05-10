import type { PoolClient } from "pg"
import { getPool } from "../../config/dbManager"

export type SeasonResetType =
  | "general_achievements"
  | "weekly_achievements"
  | "active_pauses"
  | "ranking"

let seasonResetTableEnsured = false

export const ensureSeasonResetTable = async () => {
  if (seasonResetTableEnsured) return
  const pool = await getPool()
  await pool.query(`
    CREATE TABLE IF NOT EXISTS season_reset_markers (
      id BIGSERIAL PRIMARY KEY,
      organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      department_id UUID NULL REFERENCES departments(id) ON DELETE CASCADE,
      reset_type TEXT NOT NULL CHECK (reset_type IN ('general_achievements', 'weekly_achievements', 'active_pauses', 'ranking')),
      created_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
      reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_season_reset_markers_lookup
      ON season_reset_markers(organization_id, department_id, reset_type, reset_at DESC);
  `)
  seasonResetTableEnsured = true
}

export const createSeasonResetMarker = async (
  client: PoolClient,
  input: {
    organizationId: string
    departmentId?: string | null
    resetType: SeasonResetType
    createdBy?: string | null
    resetAt?: string | Date
  }
) => {
  await ensureSeasonResetTable()
  await client.query(
    `
    INSERT INTO season_reset_markers (
      organization_id,
      department_id,
      reset_type,
      created_by,
      reset_at
    )
    VALUES ($1, $2, $3, $4, COALESCE($5::timestamptz, NOW()))
    `,
    [
      input.organizationId,
      input.departmentId ?? null,
      input.resetType,
      input.createdBy ?? null,
      input.resetAt ?? null,
    ]
  )
}

export const getLatestApplicableResetAtForUser = async (
  userId: string,
  resetType: SeasonResetType
): Promise<string | null> => {
  await ensureSeasonResetTable()
  const pool = await getPool()
  const { rows } = await pool.query<{ reset_at: Date | string | null }>(
    `
    SELECT MAX(srm.reset_at) AS reset_at
    FROM user_membership um
    LEFT JOIN season_reset_markers srm
      ON srm.organization_id = um.organization_id
     AND srm.reset_type = $2
     AND (srm.department_id IS NULL OR srm.department_id = um.department_id)
    WHERE um.user_id = $1
    `,
    [userId, resetType]
  )

  const value = rows[0]?.reset_at ?? null
  if (!value) return null
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString()
}
