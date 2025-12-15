"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { apiGet } from "@/lib/apiClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

type Summary = {
  total_users: number
  active_users_week: number
  total_pauses_week: number
  total_pauses_month: number
  avg_satisfaction: number
}

type DepartmentStat = {
  department_id: string | null
  department_name: string
  total_users: number
  active_users_week: number
  total_pauses_week: number
  total_pauses_month: number
  avg_satisfaction: number
}

type CategoryRow = {
  category: string
  total_sessions: number
}

type TrendPoint = {
  week_start: string
  sessions: number
}

type GlobalStatsResponse = {
  summary: Summary
  categories: CategoryRow[]
  weeklyTrend: TrendPoint[]
  departments: DepartmentStat[]
}

type OrgOption = {
  id: string
  name: string
  departments: { id: string; name: string }[]
}

const formatNumber = (value: number | string) =>
  Number(value || 0).toLocaleString("es-ES", { maximumFractionDigits: 1 })

export function GlobalStatsPanel() {
  const [stats, setStats] = useState<GlobalStatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orgOptions, setOrgOptions] = useState<OrgOption[]>([])
  const [selectedOrg, setSelectedOrg] = useState("global")
  const [selectedDept, setSelectedDept] = useState("all")

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (selectedOrg !== "global") {
        params.set("organizationId", selectedOrg)
        if (selectedDept !== "all") {
          params.set("departmentId", selectedDept)
        }
      }
      const query = params.toString()
      const res = await apiGet(`/api/statistics/global${query ? `?${query}` : ""}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Error al obtener estadísticas")
      setStats(data)
    } catch (err) {
      console.error("Error cargando estadísticas globales:", err)
      setStats(null)
      setError(err instanceof Error ? err.message : "No se pudieron cargar las estadísticas")
    } finally {
      setLoading(false)
    }
  }, [selectedOrg, selectedDept])

  useEffect(() => {
    fetchStats().catch(() => {})
  }, [fetchStats])

  useEffect(() => {
    if (orgOptions.length > 0) return
    ;(async () => {
      try {
        const res = await apiGet("/api/admin/org-structure")
        const data = await res.json()
        if (res.ok && Array.isArray(data.organizations)) {
          setOrgOptions(data.organizations)
        }
      } catch (err) {
        console.error("Error cargando organizaciones:", err)
      }
    })()
  }, [orgOptions.length])

  const selectedOrgData = useMemo(
    () => orgOptions.find((org) => org.id === selectedOrg),
    [orgOptions, selectedOrg]
  )

  const handleOrgChange = (value: string) => {
    setSelectedOrg(value)
    if (value === "global") {
      setSelectedDept("all")
      return
    }
    const fallbackDept = orgOptions.find((org) => org.id === value)?.departments?.[0]?.id ?? "all"
    setSelectedDept(fallbackDept)
  }

  const handleDeptChange = (value: string) => {
    setSelectedDept(value)
  }

  useEffect(() => {
    if (selectedOrg === "global") {
      setSelectedDept("all")
      return
    }
    const hasDept = selectedOrgData?.departments.some((dept) => dept.id === selectedDept)
    if (!hasDept) {
      setSelectedDept(selectedOrgData?.departments?.[0]?.id ?? "all")
    }
  }, [selectedOrg, selectedOrgData, selectedDept])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[minmax(0,320px)_minmax(0,320px)] max-w-2xl">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">Organización</p>
          <Select value={selectedOrg} onValueChange={handleOrgChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona organización" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Todas las organizaciones</SelectItem>
              {orgOptions.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedOrg !== "global" && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">Departamento</p>
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
          </div>
        )}
      </div>

      {error && <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

      {loading && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Cargando estadísticas...</span>
        </div>
      )}

      {!loading && stats && (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Usuarios totales", value: stats.summary.total_users },
              { label: "Usuarios activos (7d)", value: stats.summary.active_users_week },
              { label: "Pausas (7d)", value: stats.summary.total_pauses_week },
              { label: "Satisfacción media", value: stats.summary.avg_satisfaction },
            ].map((card) => (
              <Card key={card.label}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">{card.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-gray-900">{formatNumber(card.value)}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tendencia semanal (8 semanas)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.weeklyTrend.length === 0 && (
                  <p className="text-sm text-gray-500">Aún no hay datos suficientes.</p>
                )}
                {stats.weeklyTrend.length > 0 && (
                  <div className="space-y-3">
                    {(() => {
                      const max = Math.max(...stats.weeklyTrend.map((p) => p.sessions), 1)
                      return stats.weeklyTrend.map((point) => {
                        const width = `${Math.max((point.sessions / max) * 100, 5)}%`
                        const dateLabel = new Date(point.week_start).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                        })
                        return (
                          <div key={point.week_start}>
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>Semana {dateLabel}</span>
                              <span className="font-semibold text-gray-900">
                                {point.sessions.toLocaleString("es-ES")} pausas
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-emerald-100">
                              <div
                                className="h-full rounded-full bg-emerald-500"
                                style={{ width }}
                              />
                            </div>
                          </div>
                        )
                      })
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categorías más frecuentes (30 días)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {stats.categories.length === 0 && (
                  <p className="text-sm text-gray-500">Sin actividad registrada.</p>
                )}
                {stats.categories.map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{cat.category}</span>
                    <span className="font-semibold">{cat.total_sessions}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Actividad por departamento</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-gray-500">
                    <th className="pb-2">Departamento</th>
                    <th className="pb-2">Usuarios</th>
                    <th className="pb-2">Activos (7d)</th>
                    <th className="pb-2">Pausas 7d</th>
                    <th className="pb-2">Pausas 30d</th>
                    <th className="pb-2">Satisfacción</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.departments.length === 0 && (
                    <tr>
                      <td className="py-4 text-gray-500" colSpan={6}>
                        Sin usuarios dentro del filtro seleccionado.
                      </td>
                    </tr>
                  )}
                  {stats.departments.map((dept) => (
                    <tr key={dept.department_id ?? dept.department_name} className="border-t border-gray-100">
                      <td className="py-2">{dept.department_name}</td>
                      <td className="py-2">{formatNumber(dept.total_users)}</td>
                      <td className="py-2">{formatNumber(dept.active_users_week)}</td>
                      <td className="py-2">{formatNumber(dept.total_pauses_week)}</td>
                      <td className="py-2">{formatNumber(dept.total_pauses_month)}</td>
                      <td className="py-2">{formatNumber(dept.avg_satisfaction)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
