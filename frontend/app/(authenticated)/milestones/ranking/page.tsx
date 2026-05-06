'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { RankingUsuarios, RankingUser } from '@/components/milestones/UserRanking'
import type { RaffleThreshold, RewardMode, RewardsMap } from '@/components/milestones/RewardsPodium'
import { SvelteRewardsPodium } from '@/components/svelte/SvelteRewardsPodium'
import HuchaPanel from '@/components/milestones/DepartmentPanel'
import { calcThreeMonthGoal } from '@/lib/calcThreeMonthGoal'
import { apiGet, apiPost } from '@/lib/apiClient'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Gift, Shuffle, Sparkles } from 'lucide-react'

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
  userPosition: number | null
  totalUsers: number | null
  userExp?: number | null
  scope: RankingScope
  seasonDeadline?: string | null
  seasonTimezone?: string | null
  seasonAnchorDate?: string | null
  seasonIntervalMonths?: number | null
  membership: {
    organizationId: string | null
    organizationName: string | null
    organizationSlug?: string | null
    departmentId: string | null
    departmentName: string | null
  } | null
  canSelectOrganization: boolean
  rewardMode?: RewardMode
  rewards?: RewardsMap
  raffleThresholds?: RaffleThreshold[]
  userRaffleEntries?: number
  savedRaffleWinners?: Partial<Record<'raffle_a' | 'raffle_b', RaffleDrawResult>>
  limit?: number
  offset?: number
  searchResults?: RankingUser[]
}

type OrgOption = {
  id: string
  name: string
  departments: { id: string; name: string }[]
}

type RankingFilter =
  | { scope: 'global' }
  | { scope: 'organization'; organizationId: string; departmentId?: string }

type RaffleDrawResult = {
  rewardKey: 'raffle_a' | 'raffle_b'
  winner: {
    id: string
    first_name: string | null
    last_name: string | null
    avatar_url: string | null
    periodical_exp: number
    entries: number
  }
  totalEntries: number
  eligibleUsers: number
  drawnAt: string
}

export default function RankingPage() {
  const [goal, setGoal] = useState<number | null>(null)
  const [ranking, setRanking] = useState<RankingResponse | null>(null)
  const [loadingRanking, setLoadingRanking] = useState(true)
  const [authResolved, setAuthResolved] = useState(false)
  const [pageOffset, setPageOffset] = useState(0)
  const pageSize = 10
  const [searching, setSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<{ name: string; score: number; rank?: number }[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userOrgId, setUserOrgId] = useState<string | null>(null)
  const [userOrgSlug, setUserOrgSlug] = useState<string | null>(null)
  const [filter, setFilter] = useState<RankingFilter>({ scope: 'global' })
  const [orgOptions, setOrgOptions] = useState<OrgOption[]>([])
  const [selectedOrg, setSelectedOrg] = useState<string>('global')
  const [selectedDept, setSelectedDept] = useState<string>('all')
  const [drawingKey, setDrawingKey] = useState<'raffle_a' | 'raffle_b' | null>(null)
  const [drawResults, setDrawResults] = useState<Partial<Record<'raffle_a' | 'raffle_b', RaffleDrawResult>>>({})
  const [drawError, setDrawError] = useState<string | null>(null)
  const isSuperAdmin = (userRole ?? '').toLowerCase() === 'superadmin'
  const canRunRaffle = ['admin', 'manager', 'superadmin', 'soporte'].includes((userRole ?? '').toLowerCase())
  const fallbackDeadline = new Date('2026-05-01T00:00:01')

  const deadline = useMemo(() => {
    if (ranking?.seasonDeadline) {
      const parsed = new Date(ranking.seasonDeadline)
      if (!Number.isNaN(parsed.getTime())) return parsed
    }
    return fallbackDeadline
  }, [ranking?.seasonDeadline])

  useEffect(() => {
    ;(async () => {
      const { goal75 } = await calcThreeMonthGoal(deadline, {
        includeOneShots: true,
        onlyBusinessDays: true,
      })
      setGoal(goal75)
    })()
  }, [deadline])

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
      } catch (error) {
        console.error('Error obteniendo usuario:', error)
        setUserRole(null)
        setUserOrgId(null)
        setUserOrgSlug(null)
      } finally {
        setAuthResolved(true)
      }
    })()
  }, [])

  useEffect(() => {
    if (!userOrgId || filter.scope !== 'global') return
    if (isSuperAdmin && (userOrgSlug ?? '').toLowerCase() !== 'stn') return
    setFilter({ scope: 'organization', organizationId: userOrgId })
  }, [filter.scope, isSuperAdmin, userOrgId, userOrgSlug])

  const loadRanking = useCallback(async () => {
    setLoadingRanking(true)
    try {
      const params = new URLSearchParams()
      if (filter.scope === 'global') {
        params.set('scope', 'global')
      } else {
        params.set('organizationId', filter.organizationId)
        if (filter.departmentId) params.set('departmentId', filter.departmentId)
      }
      params.set('limit', String(pageSize))
      params.set('offset', String(pageOffset))
      const query = params.toString()
      const res = await apiGet(`/api/milestones/ranking${query ? `?${query}` : ''}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al obtener ranking')
      setRanking({
        ...data,
        rewards: data.rewards ?? {},
        rewardMode: data.rewardMode ?? 'raffle_thresholds',
        raffleThresholds: Array.isArray(data.raffleThresholds) ? data.raffleThresholds : [],
        savedRaffleWinners: data.savedRaffleWinners ?? {},
      })
    } catch (error) {
      console.error('Error al obtener ranking:', error)
      setRanking(null)
    } finally {
      setLoadingRanking(false)
    }
  }, [filter, pageOffset])

  useEffect(() => {
    loadRanking()
  }, [loadRanking])

  useEffect(() => {
    setPageOffset(0)
    setSearchQuery("")
    setSearchResults([])
  }, [filter])

  useEffect(() => {
    setDrawResults(ranking?.savedRaffleWinners ?? {})
  }, [ranking?.savedRaffleWinners])

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
      } catch (error) {
        console.error('Error cargando organizaciones para ranking:', error)
      }
    })()
  }, [isSuperAdmin, ranking?.canSelectOrganization, orgOptions.length])

  useEffect(() => {
    if (!isSuperAdmin || !ranking?.canSelectOrganization) return
    if (filter.scope === 'global') {
      setSelectedOrg('global')
      setSelectedDept('all')
    } else {
      setSelectedOrg(filter.organizationId)
      setSelectedDept(filter.departmentId ?? 'all')
    }
  }, [filter, isSuperAdmin, ranking?.canSelectOrganization])

  const selectedOrgData = useMemo(
    () => orgOptions.find((org) => org.id === selectedOrg),
    [orgOptions, selectedOrg]
  )

  const handleOrgChange = (value: string) => {
    setSelectedOrg(value)
    if (value === 'global') {
      setSelectedDept('all')
      setFilter({ scope: 'global' })
      return
    }
    const firstDept = orgOptions.find((org) => org.id === value)?.departments?.[0]?.id ?? 'all'
    const deptValue = value === selectedOrg ? selectedDept : firstDept
    setSelectedDept(deptValue)
    setFilter({
      scope: 'organization',
      organizationId: value,
      departmentId: deptValue === 'all' ? undefined : deptValue,
    })
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

  const scopeDescription = useMemo(() => {
    if (!ranking) return ''
    if (ranking.scope.mode === 'global') return 'Ranking global de Finne'
    if (ranking.scope.mode === 'organization') {
      return `Ranking de ${ranking.scope.organizationName ?? 'la organización seleccionada'}`
    }
    return `Ranking de ${ranking.scope.organizationName ?? 'tu organización'} / ${ranking.scope.departmentName ?? 'tu departamento'}`
  }, [ranking])

  const rewardsScopeLabel = useMemo(() => {
    if (!ranking?.scope) return ''
    if (ranking.scope.mode === 'global') return 'Clasificación global'
    if (ranking.scope.mode === 'organization') return `Organización: ${ranking.scope.organizationName ?? 'General'}`
    return `Departamento: ${ranking.scope.departmentName ?? 'El tuyo'}`
  }, [ranking?.scope])

  const activeThresholds = useMemo(
    () => (ranking?.raffleThresholds ?? []).filter((threshold) => threshold.active).sort((a, b) => a.min_points - b.min_points),
    [ranking?.raffleThresholds]
  )

  const isClassicTop3 = useMemo(() => {
    if (ranking?.rewardMode === 'classic_top3') return true
    const scopeSlug =
      ranking?.scope.mode === 'organization' || ranking?.scope.mode === 'department'
        ? (ranking.scope.organizationSlug ?? null)
        : null
    return (scopeSlug ?? ranking?.membership?.organizationSlug ?? '').toLowerCase() === 'stn'
  }, [ranking])

  const isStnUser = (userOrgSlug ?? '').toLowerCase() === 'stn'
  const shouldHoldStnView = isStnUser && (!authResolved || filter.scope === 'global' || loadingRanking || !isClassicTop3)

  const raffleOrganizationId = useMemo(() => {
    if (!ranking) return null
    if (ranking.scope.mode === 'organization' || ranking.scope.mode === 'department') {
      return ranking.scope.organizationId ?? null
    }
    return ranking.membership?.organizationId ?? null
  }, [ranking])

  const currentThreshold = useMemo(() => {
    if (isClassicTop3) return null
    const userExp = Number(ranking?.userExp ?? 0)
    let current: RaffleThreshold | null = null
    for (const threshold of activeThresholds) {
      if (userExp >= threshold.min_points) current = threshold
    }
    return current
  }, [activeThresholds, isClassicTop3, ranking?.userExp])

  const nextThreshold = useMemo(() => {
    if (isClassicTop3) return null
    const userExp = Number(ranking?.userExp ?? 0)
    return activeThresholds.find((threshold) => userExp < threshold.min_points) ?? null
  }, [activeThresholds, isClassicTop3, ranking?.userExp])

  const progressToNext = useMemo(() => {
    if (!ranking || isClassicTop3) return 0
    const userExp = Number(ranking.userExp ?? 0)
    if (!activeThresholds.length) return 0
    if (!nextThreshold) return 100
    const previousMin = currentThreshold?.min_points ?? 0
    const span = Math.max(1, nextThreshold.min_points - previousMin)
    const covered = Math.max(0, userExp - previousMin)
    return Math.min(100, Math.max(0, (covered / span) * 100))
  }, [activeThresholds, currentThreshold, nextThreshold, ranking, isClassicTop3])

  useEffect(() => {
    const trimmed = searchQuery.trim()
    if (!trimmed) {
      setSearchResults([])
      setSearching(false)
      return
    }
    const timer = setTimeout(async () => {
      try {
        setSearching(true)
        const params = new URLSearchParams()
        if (filter.scope === 'global') {
          params.set('scope', 'global')
        } else {
          params.set('organizationId', filter.organizationId)
          if (filter.departmentId) params.set('departmentId', filter.departmentId)
        }
        params.set('limit', String(pageSize))
        params.set('offset', String(pageOffset))
        params.set('search', trimmed)
        const res = await apiGet(`/api/milestones/ranking?${params}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'No se pudo buscar en el ranking')
        const matches = Array.isArray(data.searchResults) ? data.searchResults : []
        setSearchResults(
          matches.map((match: any) => ({
            name: `${match.first_name ?? ''} ${match.last_name ?? ''}`.trim() || 'Usuario',
            score: Number(match.periodical_exp ?? 0),
            rank: Number(match.rank ?? 0) || undefined,
          }))
        )
      } catch (error) {
        console.error('Error buscando ranking:', error)
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [searchQuery, filter, pageOffset])

  const drawRaffle = async (rewardKey: 'raffle_a' | 'raffle_b') => {
    if (!raffleOrganizationId) {
      setDrawError('Selecciona una organización para realizar el sorteo.')
      return
    }

    try {
      setDrawingKey(rewardKey)
      setDrawError(null)
      const res = await apiPost('/api/admin/rewards/raffle/draw', {
        organizationId: raffleOrganizationId,
        rewardKey,
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'No se pudo realizar el sorteo')
      }
      setDrawResults((prev) => ({ ...prev, [rewardKey]: data }))
    } catch (error: any) {
      setDrawError(error?.message || 'No se pudo realizar el sorteo')
    } finally {
      setDrawingKey(null)
    }
  }

  return (
    <div className="px-3 sm:px-6 py-4 sm:py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:gap-10 md:grid-cols-[minmax(280px,360px)_1fr]">
        {shouldHoldStnView ? (
          <div className="md:col-span-2">
            <div className="py-4">
              <div className="animate-pulse space-y-4">
                <div className="h-8 w-64 rounded bg-gray-100" />
                <div className="h-4 w-48 rounded bg-gray-100" />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(280px,360px)_1fr]">
                  <div className="space-y-4">
                    <div className="h-40 rounded-[28px] bg-gray-100" />
                    <div className="h-32 rounded-[28px] bg-gray-100" />
                  </div>
                  <div className="h-[520px] rounded-[28px] bg-gray-100" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
        <aside className="order-2 md:order-1 block w-full">
          <div className="space-y-4 md:sticky" style={{ top: '24px' }}>
            <HuchaPanel goal={goal ?? 5000} deadline={deadline} pigHeight={420} showBalloon={false} />

            {!isClassicTop3 && (
              <>
                <div className="space-y-4 border-t border-gray-200/80 pt-4">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Sparkles className="h-4 w-4" />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em]">Tu progreso</p>
                  </div>
                  <p className="mt-3 text-3xl font-bold text-gray-900">
                    {Number(ranking?.userExp ?? 0).toLocaleString('es-ES')} PA
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Participaciones actuales:{" "}
                    <span className="font-semibold text-emerald-700">
                      {Number(ranking?.userRaffleEntries ?? 0).toLocaleString('es-ES')}
                    </span>
                  </p>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                      style={{ width: `${progressToNext}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-gray-500">
                    {nextThreshold
                      ? `Te faltan ${Math.max(0, nextThreshold.min_points - Number(ranking?.userExp ?? 0)).toLocaleString('es-ES')} PA para llegar a ${nextThreshold.entries_count} participac${nextThreshold.entries_count === 1 ? 'ión' : 'iones'}.`
                      : currentThreshold
                        ? `Has alcanzado el umbral máximo y mantienes ${currentThreshold.entries_count.toLocaleString('es-ES')} participac${currentThreshold.entries_count === 1 ? 'ión' : 'iones'}.`
                        : 'Aún no has alcanzado el primer umbral de participaciones.'}
                  </p>
                </div>

                <div className="space-y-2 border-t border-gray-200/80 pt-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Gift className="h-4 w-4" />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em]">Premio Top 1</p>
                  </div>
                  <p className="mt-3 text-base font-semibold text-gray-900">
                    {ranking?.rewards?.guaranteed_winner?.title ?? 'Pendiente de configurar'}
                  </p>
                  {ranking?.rewards?.guaranteed_winner?.description && (
                    <p className="mt-2 text-sm text-gray-500">{ranking.rewards.guaranteed_winner.description}</p>
                  )}
                </div>

                <div className="space-y-2 border-t border-gray-200/80 pt-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Gift className="h-4 w-4" />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em]">Premio sorteo</p>
                  </div>
                  <p className="mt-3 text-base font-semibold text-gray-900">
                    {ranking?.rewards?.raffle_a?.title ?? 'Pendiente de configurar'}
                  </p>
                  {ranking?.rewards?.raffle_a?.description && (
                    <p className="mt-2 text-sm text-gray-500">{ranking.rewards.raffle_a.description}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </aside>

        <section aria-labelledby="ranking-title" className="order-1 md:order-2 w-full space-y-4">
          <div>
            <h2 id="ranking-title" className="text-xl font-semibold">Ranking de temporada</h2>
            <p className="text-sm text-gray-500">{scopeDescription}</p>
          </div>

          {isSuperAdmin && ranking?.canSelectOrganization && orgOptions.length > 0 && (
            <div className="space-y-3">
              <Select value={selectedOrg} onValueChange={handleOrgChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona organización" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Ranking global</SelectItem>
                  {orgOptions.map((org) => (
                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedOrg !== 'global' && (
                <Select value={selectedDept} onValueChange={handleDeptChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los departamentos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los departamentos</SelectItem>
                    {(selectedOrgData?.departments ?? []).map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {!ranking?.canSelectOrganization && ranking?.scope.mode === 'department' && ranking.scope.organizationName && (
            <p className="text-sm text-gray-500">
              Mostrando sólo a compañeros de {ranking.scope.organizationName} / {ranking.scope.departmentName ?? 'tu departamento'}.
            </p>
          )}

          <div className="relative">
            <button
              type="button"
              className="hidden md:flex absolute -left-14 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 items-center justify-center"
              onClick={() => setPageOffset(Math.max(0, pageOffset - pageSize))}
              disabled={pageOffset <= 0}
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="hidden md:flex absolute -right-14 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 items-center justify-center"
              onClick={() =>
                setPageOffset(
                  ranking?.totalUsers
                    ? Math.min(ranking.totalUsers - 1, pageOffset + pageSize)
                    : pageOffset + pageSize
                )
              }
              disabled={Boolean(ranking?.totalUsers && pageOffset + pageSize >= ranking.totalUsers)}
              aria-label="Página siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <RankingUsuarios
              usuarios={ranking?.top ?? []}
              userPosition={ranking?.userPosition ?? null}
              totalUsuarios={ranking?.totalUsers ?? null}
              loading={loadingRanking}
              rewards={ranking?.rewards}
              rewardMode={isClassicTop3 ? 'classic_top3' : ranking?.rewardMode}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searching={searching}
              searchResults={searchResults}
              pageOffset={pageOffset}
            />
          </div>

          {!isClassicTop3 && !!activeThresholds.length && (
            <div className="border-t border-gray-200/80 pt-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Umbrales de participaciones
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {activeThresholds.map((threshold) => (
                  <div key={threshold.id} className="border-t border-emerald-100 bg-emerald-50/20 px-0 py-3">
                    <p className="text-sm text-gray-500">Desde {threshold.min_points.toLocaleString('es-ES')} PA</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {threshold.entries_count} participac{threshold.entries_count === 1 ? 'ión' : 'iones'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 md:hidden">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setPageOffset(Math.max(0, pageOffset - pageSize))}
              disabled={pageOffset <= 0}
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              onClick={() =>
                setPageOffset(
                  ranking?.totalUsers
                    ? Math.min(ranking.totalUsers - 1, pageOffset + pageSize)
                    : pageOffset + pageSize
                )
              }
              disabled={Boolean(ranking?.totalUsers && pageOffset + pageSize >= ranking.totalUsers)}
              aria-label="Página siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <section className="border-t border-gray-200/80 pt-8">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
                  Recompensas de temporada
                </p>
                <h3 className="mt-2 text-xl font-semibold text-gray-900">
                  Premios y participaciones
                </h3>
              </div>

              {!isClassicTop3 && canRunRaffle && raffleOrganizationId && (
                <div className="flex flex-wrap gap-2">
                  {(['raffle_a', 'raffle_b'] as const).map((rewardKey) => (
                    <button
                      key={rewardKey}
                      type="button"
                      onClick={() => drawRaffle(rewardKey)}
                      disabled={drawingKey !== null}
                      className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Shuffle className="h-4 w-4" />
                      {drawingKey === rewardKey
                        ? 'Sorteando...'
                        : rewardKey === 'raffle_a'
                          ? 'Sortear premio A'
                          : 'Sortear premio B'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {drawError && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {drawError}
              </div>
            )}

            {!!Object.keys(drawResults).length && (
              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                {(['raffle_a', 'raffle_b'] as const).map((rewardKey) => {
                  const result = drawResults[rewardKey]
                  if (!result) return null
                  const name = `${result.winner.first_name ?? ''} ${result.winner.last_name ?? ''}`.trim() || 'Usuario'
                  return (
                    <div key={rewardKey} className="border-t border-emerald-100 bg-emerald-50/30 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                        {rewardKey === 'raffle_a' ? 'Ganador sorteo A' : 'Ganador sorteo B'}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-gray-900">{name}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        {result.winner.entries.toLocaleString('es-ES')} participaciones entre{' '}
                        {result.totalEntries.toLocaleString('es-ES')} totales.
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Sorteado el{" "}
                        {new Date(result.drawnAt).toLocaleString('es-ES', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}

            <SvelteRewardsPodium
              users={ranking?.top ?? []}
              rewards={ranking?.rewards}
              rewardMode={isClassicTop3 ? 'classic_top3' : ranking?.rewardMode}
              raffleThresholds={ranking?.raffleThresholds}
              userRaffleEntries={ranking?.userRaffleEntries}
              scopeLabel={rewardsScopeLabel}
              loading={loadingRanking}
            />
          </section>
        </section>
          </>
        )}
      </div>
    </div>
  )
}
