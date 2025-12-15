import {
  RewardDefinitionRow,
  RewardScopeType,
  getRewardDefinitionsForScope,
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
  title: string
  description: string | null
  image_url: string | null
  cta_url: string | null
  scope_type: RewardScopeType
  scope_id: string | null
}

const mapRowToPayload = (row: RewardDefinitionRow): RewardPayload => ({
  id: row.id,
  title: row.title,
  description: row.description,
  image_url: row.image_url,
  cta_url: row.cta_url,
  scope_type: row.scope_type,
  scope_id: row.scope_id,
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
  const rewards: Record<number, RewardPayload> = {}
  const chain = scopeChainFromInfo(scope)

  for (const entry of chain) {
    const rows = await getRewardDefinitionsForScope(entry.scopeType, entry.scopeId)
    for (const row of rows) {
      if (!rewards[row.position]) {
        rewards[row.position] = mapRowToPayload(row)
      }
    }
    if (Object.keys(rewards).length >= 3) break
  }

  return rewards
}
