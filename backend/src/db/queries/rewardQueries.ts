import { getPool } from "../../config/dbManager"

export type RewardScopeType = "global" | "organization" | "department"
export type RewardKey = "guaranteed_winner" | "raffle_a" | "raffle_b"

export type RewardDefinitionRow = {
  id: string
  scope_type: RewardScopeType
  scope_id: string | null
  position: number | null
  reward_key: RewardKey
  title: string
  description: string | null
  image_url: string | null
  cta_url: string | null
  updated_by: string
  updated_at: Date
}

export type RewardRaffleThresholdRow = {
  id: string
  organization_id: string
  min_points: number
  entries_count: number
  active: boolean
  updated_by: string | null
  created_at: Date
  updated_at: Date
}

export type RewardRaffleCandidateRow = {
  id: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  periodical_exp: number
}

export type RewardRaffleDrawRow = {
  id: number
  organization_id: string
  reward_key: Exclude<RewardKey, "guaranteed_winner">
  winner_user_id: string
  winner_entries: number
  total_entries: number
  eligible_users: number
  excluded_top_user_id: string | null
  drawn_by: string | null
  drawn_at: Date
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  periodical_exp: number
}

let raffleDrawsTableEnsured = false

export const ensureRewardRaffleDrawsTable = async () => {
  if (raffleDrawsTableEnsured) return
  const pool = await getPool()
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reward_raffle_draws (
      id BIGSERIAL PRIMARY KEY,
      organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      reward_key TEXT NOT NULL CHECK (reward_key IN ('raffle_a', 'raffle_b')),
      winner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      winner_entries INTEGER NOT NULL,
      total_entries INTEGER NOT NULL,
      eligible_users INTEGER NOT NULL,
      excluded_top_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
      drawn_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
      drawn_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_reward_raffle_draws_org_key_drawn_at
      ON reward_raffle_draws(organization_id, reward_key, drawn_at DESC, id DESC);
  `)
  raffleDrawsTableEnsured = true
}

const normalizeScopeId = (scopeType: RewardScopeType, scopeId?: string | null) => {
  if (scopeType === "global") return null
  return scopeId ?? null
}

export const getRewardDefinitionsForScope = async (
  scopeType: RewardScopeType,
  scopeId?: string | null
) => {
  const pool = await getPool()
  const normalizedScopeId = normalizeScopeId(scopeType, scopeId)
  const { rows } = await pool.query<RewardDefinitionRow>(
    `
    SELECT *
    FROM reward_definitions
    WHERE scope_type = $1
      AND (($2::uuid IS NULL AND scope_id IS NULL) OR scope_id = $2)
    ORDER BY COALESCE(position, 999), reward_key
    `,
    [scopeType, normalizedScopeId]
  )
  return rows
}

export const upsertRewardDefinition = async (
  scopeType: RewardScopeType,
  scopeId: string | null,
  rewardKey: RewardKey,
  title: string,
  description: string | null,
  imageUrl: string | null,
  ctaUrl: string | null,
  updatedBy: string,
  position: number | null = null
) => {
  const pool = await getPool()
  const normalizedScopeId = normalizeScopeId(scopeType, scopeId)
  const { rows } = await pool.query<RewardDefinitionRow>(
    `
    INSERT INTO reward_definitions (
      scope_type,
      scope_id,
      position,
      reward_key,
      title,
      description,
      image_url,
      cta_url,
      updated_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (scope_type, scope_id, reward_key)
    DO UPDATE SET
      position = EXCLUDED.position,
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      image_url = EXCLUDED.image_url,
      cta_url = EXCLUDED.cta_url,
      updated_by = EXCLUDED.updated_by,
      updated_at = NOW()
    RETURNING *
    `,
    [scopeType, normalizedScopeId, position, rewardKey, title, description, imageUrl, ctaUrl, updatedBy]
  )
  return rows[0] || null
}

export const deleteRewardDefinition = async (id: string) => {
  const pool = await getPool()
  await pool.query(`DELETE FROM reward_definitions WHERE id = $1`, [id])
}

export const getRaffleThresholdsByOrganization = async (organizationId: string) => {
  const pool = await getPool()
  const { rows } = await pool.query<RewardRaffleThresholdRow>(
    `
    SELECT *
    FROM reward_raffle_thresholds
    WHERE organization_id = $1
    ORDER BY min_points ASC
    `,
    [organizationId]
  )
  return rows
}

export const replaceRaffleThresholdsByOrganization = async (
  organizationId: string,
  thresholds: Array<{ min_points: number; entries_count: number; active: boolean }>,
  updatedBy: string | null
) => {
  const pool = await getPool()
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    await client.query(`DELETE FROM reward_raffle_thresholds WHERE organization_id = $1`, [organizationId])

    const results: RewardRaffleThresholdRow[] = []
    for (const threshold of thresholds) {
      const { rows } = await client.query<RewardRaffleThresholdRow>(
        `
        INSERT INTO reward_raffle_thresholds (
          organization_id,
          min_points,
          entries_count,
          active,
          updated_by
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [organizationId, threshold.min_points, threshold.entries_count, threshold.active, updatedBy]
      )
      if (rows[0]) results.push(rows[0])
    }

    await client.query("COMMIT")
    return results
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

export const getRaffleCandidatesByOrganization = async (organizationId: string) => {
  const pool = await getPool()
  const { rows } = await pool.query<RewardRaffleCandidateRow>(
    `
    SELECT DISTINCT
      u.id,
      u.first_name,
      u.last_name,
      u.avatar_url,
      COALESCE(u.periodical_exp, 0) AS periodical_exp
    FROM users u
    INNER JOIN user_membership um ON um.user_id = u.id
    WHERE um.organization_id = $1
    ORDER BY COALESCE(u.periodical_exp, 0) DESC, u.first_name ASC, u.last_name ASC
    `,
    [organizationId]
  )
  return rows
}

export const createRewardRaffleDraw = async (input: {
  organizationId: string
  rewardKey: Exclude<RewardKey, "guaranteed_winner">
  winnerUserId: string
  winnerEntries: number
  totalEntries: number
  eligibleUsers: number
  excludedTopUserId: string | null
  drawnBy: string | null
}) => {
  await ensureRewardRaffleDrawsTable()
  const pool = await getPool()
  const { rows } = await pool.query<RewardRaffleDrawRow>(
    `
    INSERT INTO reward_raffle_draws (
      organization_id,
      reward_key,
      winner_user_id,
      winner_entries,
      total_entries,
      eligible_users,
      excluded_top_user_id,
      drawn_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING
      id,
      organization_id,
      reward_key,
      winner_user_id,
      winner_entries,
      total_entries,
      eligible_users,
      excluded_top_user_id,
      drawn_by,
      drawn_at,
      NULL::text AS first_name,
      NULL::text AS last_name,
      NULL::text AS avatar_url,
      0::int AS periodical_exp
    `,
    [
      input.organizationId,
      input.rewardKey,
      input.winnerUserId,
      input.winnerEntries,
      input.totalEntries,
      input.eligibleUsers,
      input.excludedTopUserId,
      input.drawnBy,
    ]
  )
  return rows[0] || null
}

export const getLatestRewardRaffleDrawsByOrganization = async (organizationId: string) => {
  await ensureRewardRaffleDrawsTable()
  const pool = await getPool()
  const { rows } = await pool.query<RewardRaffleDrawRow>(
    `
    SELECT DISTINCT ON (rrd.reward_key)
      rrd.id,
      rrd.organization_id,
      rrd.reward_key,
      rrd.winner_user_id,
      rrd.winner_entries,
      rrd.total_entries,
      rrd.eligible_users,
      rrd.excluded_top_user_id,
      rrd.drawn_by,
      rrd.drawn_at,
      u.first_name,
      u.last_name,
      u.avatar_url,
      COALESCE(u.periodical_exp, 0) AS periodical_exp
    FROM reward_raffle_draws rrd
    INNER JOIN users u ON u.id = rrd.winner_user_id
    WHERE rrd.organization_id = $1
    ORDER BY rrd.reward_key, rrd.drawn_at DESC, rrd.id DESC
    `,
    [organizationId]
  )
  return rows
}
