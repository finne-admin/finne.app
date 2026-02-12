'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { RankingUsuarios, RankingUser } from '@/components/milestones/UserRanking'
import HuchaPanel from '@/components/milestones/DepartmentPanel'
import { calcThreeMonthGoal } from '@/lib/calcThreeMonthGoal'
import { apiGet } from '@/lib/apiClient'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type RankingScope =
  | { mode: 'global' }
  | {
      mode: 'organization' | 'department'
      organizationId: string | null
      organizationName: string | null
      departmentId: string | null
      departmentName: string | null
    }

type PodiumReward = {
  title: string
  description?: string | null
  image_url?: string | null
  cta_url?: string | null
}

type RankingResponse = {
  top: RankingUser[]
  userPosition: number | null
  totalUsers: number | null
  userExp?: number | null
  scope: RankingScope
  seasonDeadline?: string | null
  seasonTimezone?: string | null
  membership: {
    organizationId: string | null
    organizationName: string | null
    departmentId: string | null
    departmentName: string | null
  } | null
  canSelectOrganization: boolean
  rewards?: Record<number, PodiumReward>
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

export default function RankingPage() {
  const [goal, setGoal] = useState<number | null>(null)

  const [ranking, setRanking] = useState<RankingResponse | null>(null)
  const [loadingRanking, setLoadingRanking] = useState(true)
  const [pageOffset, setPageOffset] = useState(0)
  const pageSize = 10
  const [searching, setSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<
    { name: string; score: number; rank?: number }[]
  >([])
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userOrgId, setUserOrgId] = useState<string | null>(null)
  const [filter, setFilter] = useState<RankingFilter>({ scope: 'global' })
  const [orgOptions, setOrgOptions] = useState<OrgOption[]>([])
  const [selectedOrg, setSelectedOrg] = useState<string>('global')
  const [selectedDept, setSelectedDept] = useState<string>('all')
  const isSuperAdmin = (userRole ?? '').toLowerCase() === 'superadmin'
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
        } else {
          setUserRole(null)
          setUserOrgId(null)
        }
      } catch (error) {
        console.error('Error obteniendo usuario:', error)
        setUserRole(null)
        setUserOrgId(null)
      }
    })()
  }, [])

  useEffect(() => {
    if (isSuperAdmin) return
    if (!userOrgId) return
    if (filter.scope !== 'global') return
    setFilter({ scope: 'organization', organizationId: userOrgId })
  }, [filter.scope, isSuperAdmin, userOrgId])

  const loadRanking = useCallback(async () => {
    setLoadingRanking(true)
    try {
      const params = new URLSearchParams()
      if (filter.scope === 'global') {
        params.set('scope', 'global')
      } else if (filter.scope === 'organization') {
        params.set('organizationId', filter.organizationId)
        if (filter.departmentId) {
          params.set('departmentId', filter.departmentId)
        }
      }
      params.set('limit', String(pageSize))
      params.set('offset', String(pageOffset))
      const query = params.toString()
      const res = await apiGet(`/api/milestones/ranking${query ? `?${query}` : ''}`)
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Error al obtener ranking')
      }
      setRanking({
        ...data,
        rewards: data.rewards ?? {},
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
    } else if (filter.scope === 'organization') {
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
    } else {
      const firstDept = selectedOrgData?.departments?.[0]?.id ?? 'all'
      const fallbackDept =
        orgOptions.find((org) => org.id === value)?.departments?.[0]?.id ?? 'all'
      const deptValue = value === selectedOrg ? selectedDept : fallbackDept
      setSelectedDept(deptValue)
      setFilter({
        scope: 'organization',
        organizationId: value,
        departmentId: deptValue === 'all' ? undefined : deptValue,
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

  const scopeDescription = useMemo(() => {
    if (!ranking) return ''
    if (ranking.scope.mode === 'global') return 'Ranking global de Finne'
    if (ranking.scope.mode === 'organization') {
      return `Ranking de ${ranking.scope.organizationName ?? 'la organización seleccionada'}`
    }
    return `Ranking de ${ranking.scope.organizationName ?? 'tu organización'} / ${
      ranking.scope.departmentName ?? 'tu departamento'
    }`
  }, [ranking])

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
        } else if (filter.scope === 'organization') {
          params.set('organizationId', filter.organizationId)
          if (filter.departmentId) {
            params.set('departmentId', filter.departmentId)
          }
        }
        params.set('limit', String(pageSize))
        params.set('offset', String(pageOffset))
        params.set('search', trimmed)
        const res = await apiGet(`/api/milestones/ranking?${params}`)
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'No se pudo buscar en el ranking')
        }
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

  return (
    <div className="px-6 py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[1fr_auto] gap-10">
        <section aria-labelledby="ranking-title" className="w-full max-w-3xl space-y-4">
          <div>
            <h2 id="ranking-title" className="text-xl font-semibold">
              Ranking de temporada
            </h2>
            <p className="text-sm text-gray-500">{scopeDescription}</p>
            {typeof ranking?.userExp === 'number' && (
              <p className="mt-1 text-sm text-emerald-600 font-semibold">
                Tu EXP: {ranking.userExp} PA
              </p>
            )}
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
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
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
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {!ranking?.canSelectOrganization &&
            ranking?.scope.mode === 'department' &&
            ranking.scope.organizationName && (
              <p className="text-sm text-gray-500">
                Mostrando sólo a compañeros de {ranking.scope.organizationName} /{' '}
                {ranking.scope.departmentName ?? 'tu departamento'}.
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
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searching={searching}
              searchResults={searchResults}
              pageOffset={pageOffset}
            />
          </div>
        </section>

        <aside className="block w-[clamp(240px,28vw,520px)]">
          <div
            className="sticky"
            style={{
              ['--pig' as any]: 'clamp(240px,28vw,520px)',
              top: 'calc(100vh - var(--pig) - 20px)',
            }}
          >
            <HuchaPanel goal={goal ?? 5000} deadline={deadline} pigHeight={520} />
          </div>
        </aside>
      </div>
    </div>
  )
}
