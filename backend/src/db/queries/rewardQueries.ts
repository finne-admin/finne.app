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
