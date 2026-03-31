'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiGet } from '@/lib/apiClient'
import type { RaffleThreshold, RewardMode, RewardsMap } from '@/components/milestones/RewardsPodium'
import { SvelteRewardsPodium } from '@/components/svelte/SvelteRewardsPodium'
import type { RankingUser } from '@/components/milestones/UserRanking'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type RankingScope =
  | { mode: 'global' }
  | {
      mode: 'organization' | 'department'
      organizationId: string | null
      organizationName: string | null
      organizationSlug?: string | null
      departmentId: string | null
      departmentName: string | null
    }

type RankingResponse = {
  top: RankingUser[]
  scope: RankingScope
  rewards?: RewardsMap
  rewardMode?: RewardMode
  raffleThresholds?: RaffleThreshold[]
  userRaffleEntries?: number
  canSelectOrganization: boolean
  membership: {
    organizationId: string | null
    organizationName: string | null
    departmentId: string | null
    departmentName: string | null
  } | null
}

type OrgOption = {
  id: string
  name: string
  departments: { id: string; name: string }[]
}

type RankingFilter =
  | { scope: 'global' }
  | { scope: 'organization'; organizationId: string; departmentId?: string }

export default function RecompensasPage() {
  const [ranking, setRanking] = useState<RankingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [authResolved, setAuthResolved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userOrgId, setUserOrgId] = useState<string | null>(null)
  const [userOrgSlug, setUserOrgSlug] = useState<string | null>(null)
  const [orgOptions, setOrgOptions] = useState<OrgOption[]>([])
  const [filter, setFilter] = useState<RankingFilter>({ scope: 'global' })
  const [selectedOrg, setSelectedOrg] = useState<string>('global')
  const [selectedDept, setSelectedDept] = useState<string>('all')
  const isSuperAdmin = (userRole ?? '').toLowerCase() === 'superadmin'

  const selectedOrgData = useMemo(
    () => orgOptions.find((org) => org.id === selectedOrg),
    [orgOptions, selectedOrg]
  )

  useEffect(() => {
    ;(async () => {
      try {
        const res = await apiGet('/api/auth/me')
        const data = await res.json()
        if (res.ok) {
          setUserRole(data?.user?.roleName || data?.user?.role || null)
          setUserOrgId(data?.user?.organizationId || null)
          setUserOrgSlug(data?.user?.organizationSlug || null)
        } else {
          setUserRole(null)
          setUserOrgId(null)
          setUserOrgSlug(null)
        }
      } catch (err) {
        console.error('Error obteniendo usuario:', err)
        setUserRole(null)
        setUserOrgId(null)
        setUserOrgSlug(null)
      } finally {
        setAuthResolved(true)
      }
    })()
  }, [])

  const fetchRanking = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filter.scope === 'global') {
        params.set('scope', 'global')
      } else {
        params.set('organizationId', filter.organizationId)
        if (filter.departmentId) params.set('departmentId', filter.departmentId)
      }

      const res = await apiGet(`/api/milestones/ranking${params.toString() ? `?${params}` : ''}`)
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'No se pudo cargar el ranking')
      }
      setRanking({
        top: Array.isArray(data.top) ? data.top : [],
        scope: data.scope,
        rewards: data.rewards ?? {},
        rewardMode: data.rewardMode ?? 'raffle_thresholds',
        raffleThresholds: Array.isArray(data.raffleThresholds) ? data.raffleThresholds : [],
        userRaffleEntries: Number(data.userRaffleEntries ?? 0),
        canSelectOrganization: Boolean(data.canSelectOrganization),
        membership: data.membership ?? null,
      })
    } catch (err: any) {
      console.error('Error al cargar ranking para recompensas:', err)
      setError(err.message || 'No se pudo cargar el podio')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchRanking()
  }, [fetchRanking])

  useEffect(() => {
    if (!isSuperAdmin) return
    if (!ranking?.canSelectOrganization || orgOptions.length > 0) return
    ;(async () => {
      try {
        const res = await apiGet('/api/admin/org-structure')
        const data = await res.json()
        if (res.ok && Array.isArray(data.organizations)) {
          setOrgOptions(data.organizations)
        }
      } catch (err) {
        console.error('Error cargando estructura organizativa:', err)
      }
    })()
  }, [isSuperAdmin, ranking?.canSelectOrganization, orgOptions.length])

  useEffect(() => {
    if (!isSuperAdmin || !ranking?.canSelectOrganization) return
    if (filter.scope === 'global') {
      setSelectedOrg('global')
      setSelectedDept('all')
    } else if (filter.scope === 'organization') {
      setSelectedOrg(filter.organizationId)
      setSelectedDept(filter.departmentId ?? 'all')
    }
  }, [filter, isSuperAdmin, ranking?.canSelectOrganization])

  useEffect(() => {
    if (!userOrgId || filter.scope !== 'global') return
    if (isSuperAdmin && (userOrgSlug ?? '').toLowerCase() !== 'stn') return
    setFilter({ scope: 'organization', organizationId: userOrgId })
  }, [filter.scope, isSuperAdmin, userOrgId, userOrgSlug])

  const handleOrgChange = (value: string) => {
    setSelectedOrg(value)
    if (value === 'global') {
      setSelectedDept('all')
      setFilter({ scope: 'global' })
    } else {
      const org = orgOptions.find((item) => item.id === value)
      const nextDept = org?.departments?.[0]?.id ?? 'all'
      setSelectedDept(nextDept)
      setFilter({
        scope: 'organization',
        organizationId: value,
        departmentId: nextDept === 'all' ? undefined : nextDept,
      })
    }
  }

  const handleDeptChange = (value: string) => {
    setSelectedDept(value)
    if (selectedOrg === 'global') return
    setFilter({
      scope: 'organization',
      organizationId: selectedOrg,
      departmentId: value === 'all' ? undefined : value,
    })
  }

  const scopeLabel = useMemo(() => {
    if (!ranking?.scope) return ''
    switch (ranking.scope.mode) {
      case 'global':
        return 'Clasificación global'
      case 'organization':
        return `Organización: ${ranking.scope.organizationName ?? 'General'}`
      case 'department':
        return `Departamento: ${ranking.scope.departmentName ?? 'El tuyo'}`
      default:
        return ''
    }
  }, [ranking?.scope])

  const podiumUsers = ranking?.top ?? []
  const isClassicTop3 = useMemo(() => {
    if (ranking?.rewardMode === 'classic_top3') return true
    const scopeSlug =
      ranking?.scope?.mode === 'organization' || ranking?.scope?.mode === 'department'
        ? (ranking.scope.organizationSlug ?? null)
        : null
    return (scopeSlug ?? '').toLowerCase() === 'stn'
  }, [ranking])

  const isStnUser = (userOrgSlug ?? '').toLowerCase() === 'stn'
  const shouldHoldStnView = isStnUser && (!authResolved || filter.scope === 'global' || loading || !isClassicTop3)

  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-10">
        {shouldHoldStnView ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="animate-pulse space-y-5">
              <div className="mx-auto h-8 w-96 rounded bg-gray-100" />
              <div className="mx-auto h-4 w-72 rounded bg-gray-100" />
              <div className="mx-auto h-16 max-w-4xl rounded-3xl bg-gray-100" />
              <div className="h-[640px] rounded-3xl bg-gray-100" />
            </div>
          </div>
        ) : (
          <>
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-500 font-semibold">Centro de recompensas</p>
          <h1 className="text-3xl font-bold text-gray-900">Reconocemos a quienes mantienen viva la actitud activa</h1>
          <p className="text-sm text-gray-600 max-w-3xl mx-auto">
            Mantén tu racha, participa y conquista el podio.
          </p>
        </div>

        {isSuperAdmin && ranking?.canSelectOrganization && orgOptions.length > 0 && (
          <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-3xl border border-emerald-100 bg-white/80 p-4 shadow-sm md:flex-row md:items-center">
            <Select value={selectedOrg} onValueChange={handleOrgChange}>
              <SelectTrigger className="w-full md:w-60">
                <SelectValue placeholder="Ámbito" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global</SelectItem>
                {orgOptions.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedOrg !== 'global' && (
              <Select value={selectedDept} onValueChange={handleDeptChange}>
                <SelectTrigger className="w-full md:w-60">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los departamentos</SelectItem>
                  {(selectedOrgData?.departments ?? []).map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600">{error}</div>
        ) : (
          <SvelteRewardsPodium
            users={podiumUsers}
            rewards={ranking?.rewards}
            rewardMode={isClassicTop3 ? 'classic_top3' : ranking?.rewardMode}
            raffleThresholds={ranking?.raffleThresholds}
            userRaffleEntries={ranking?.userRaffleEntries}
            scopeLabel={scopeLabel}
            loading={loading}
          />
        )}
          </>
        )}
      </div>
    </div>
  )
}
