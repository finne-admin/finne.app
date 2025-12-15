import { getPool } from "../../config/dbManager"

export type RewardScopeType = "global" | "organization" | "department"

export type RewardDefinitionRow = {
  id: string
  scope_type: RewardScopeType
  scope_id: string | null
  position: number
  title: string
  description: string | null
  image_url: string | null
  cta_url: string | null
  updated_by: string
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
    ORDER BY position
    `,
    [scopeType, normalizedScopeId]
  )
  return rows
}

export const upsertRewardDefinition = async (
  scopeType: RewardScopeType,
  scopeId: string | null,
  position: number,
  title: string,
  description: string | null,
  imageUrl: string | null,
  ctaUrl: string | null,
  updatedBy: string
) => {
  const pool = await getPool()
  const normalizedScopeId = normalizeScopeId(scopeType, scopeId)
  const { rows } = await pool.query<RewardDefinitionRow>(
    `
    INSERT INTO reward_definitions (
      scope_type,
      scope_id,
      position,
      title,
      description,
      image_url,
      cta_url,
      updated_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (scope_type, scope_id, position)
    DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      image_url = EXCLUDED.image_url,
      cta_url = EXCLUDED.cta_url,
      updated_by = EXCLUDED.updated_by,
      updated_at = NOW()
    RETURNING *
    `,
    [scopeType, normalizedScopeId, position, title, description, imageUrl, ctaUrl, updatedBy]
  )
  return rows[0] || null
}

export const deleteRewardDefinition = async (id: string) => {
  const pool = await getPool()
  await pool.query(`DELETE FROM reward_definitions WHERE id = $1`, [id])
}
