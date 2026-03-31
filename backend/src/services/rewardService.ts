import {
  RewardDefinitionRow,
  RewardKey,
  RewardRaffleThresholdRow,
  RewardScopeType,
  getRewardDefinitionsForScope,
  getRaffleThresholdsByOrganization,
} from "../db/queries/rewardQueries"

type ScopeInfo =
  | { mode: "global" }
  | {
      mode: "organization"
      organizationId: string | null
    }
  | {
      mode: "department"
      organizationId: string | null
      departmentId: string | null
    }

export type RewardPayload = {
  id: string
  reward_key: RewardKey
  title: string
  description: string | null
  image_url: string | null
  cta_url: string | null
  scope_type: RewardScopeType
  scope_id: string | null
}

export type RaffleThresholdPayload = {
  id: string
  organization_id: string
  min_points: number
  entries_count: number
  active: boolean
}

const mapRowToPayload = (row: RewardDefinitionRow): RewardPayload => ({
  id: row.id,
  reward_key: row.reward_key,
  title: row.title,
  description: row.description,
  image_url: row.image_url,
  cta_url: row.cta_url,
  scope_type: row.scope_type,
  scope_id: row.scope_id,
})

const mapThresholdRowToPayload = (row: RewardRaffleThresholdRow): RaffleThresholdPayload => ({
  id: row.id,
  organization_id: row.organization_id,
  min_points: Number(row.min_points ?? 0),
  entries_count: Number(row.entries_count ?? 0),
  active: Boolean(row.active),
})

const scopeChainFromInfo = (scope: ScopeInfo) => {
  const chain: { scopeType: RewardScopeType; scopeId: string | null }[] = []
  if (scope.mode === "department" && scope.departmentId) {
    chain.push({ scopeType: "department", scopeId: scope.departmentId })
  }
  if ((scope.mode === "department" || scope.mode === "organization") && scope.organizationId) {
    chain.push({ scopeType: "organization", scopeId: scope.organizationId })
  }
  chain.push({ scopeType: "global", scopeId: null })
  return chain
}

export const resolveRewardsForScope = async (scope: ScopeInfo) => {
  const rewards: Partial<Record<RewardKey, RewardPayload>> = {}
  const chain = scopeChainFromInfo(scope)

  for (const entry of chain) {
    const rows = await getRewardDefinitionsForScope(entry.scopeType, entry.scopeId)
    for (const row of rows) {
      if (!rewards[row.reward_key]) {
        rewards[row.reward_key] = mapRowToPayload(row)
      }
    }
    if (Object.keys(rewards).length >= 3) break
  }

  return rewards
}

export const getOrganizationRaffleThresholds = async (organizationId?: string | null) => {
  if (!organizationId) return []
  const rows = await getRaffleThresholdsByOrganization(organizationId)
  return rows.map(mapThresholdRowToPayload)
}

export const calculateRaffleEntriesForPoints = (
  points: number,
  thresholds: RaffleThresholdPayload[]
) => {
  const safePoints = Number(points ?? 0)
  const activeThresholds = thresholds
    .filter((threshold) => threshold.active)
    .sort((a, b) => a.min_points - b.min_points)

  let entries = 0
  for (const threshold of activeThresholds) {
    if (safePoints >= threshold.min_points) {
      entries = threshold.entries_count
    }
  }

  return entries
}
