"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { apiGet } from "@/lib/apiClient"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Bar, Line } from "react-chartjs-2"
import {
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  Chart as ChartJS,
} from "chart.js"
import type { ChartOptions } from "chart.js"
import { ActivityIcon, Award, HeartIcon, UsersIcon } from "lucide-react"

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler)

type Summary = {
  total_users: number
  active_users_week: number
  total_pauses_week: number
  total_pauses_month: number
  total_pauses_all: number
  avg_satisfaction: number
  week_minutes: number
  month_minutes: number
}

type DepartmentRow = {
  department_id: string | null
  department_name: string
  total_users: number
  active_users_week: number
  total_pauses_week: number
  total_pauses_month: number
  avg_satisfaction: number
}

type TopRatedExercise = {
  title: string
  wistia_id: string | null
  ratings: number
  avg_satisfaction: number
}

type StatsResponse = {
  summary: Summary
  categories: { category: string; total_sessions: number }[]
  weeklyTrend: { week_start: string; sessions: number; avg_satisfaction?: number }[]
  dailyTrend: { day: string; sessions: number }[]
  monthlyTrend: { month: string; sessions: number }[]
  departments: DepartmentRow[]
  topRatedExercises: TopRatedExercise[]
}

type OrgOption = {
  id: string
  name: string
  departments: { id: string; name: string }[]
}

const EMPTY_STATS: StatsResponse = {
  summary: {
    total_users: 0,
    active_users_week: 0,
    total_pauses_week: 0,
    total_pauses_month: 0,
    total_pauses_all: 0,
    avg_satisfaction: 0,
    week_minutes: 0,
    month_minutes: 0,
  },
  categories: [],
  weeklyTrend: [],
  dailyTrend: [],
  monthlyTrend: [],
  departments: [],
  topRatedExercises: [],
}

const formatPercent = (value: number) => `${value.toFixed(1)}%`
const formatNumber = (value: number) => value.toLocaleString("es-ES")
const formatHours = (minutes: number) => {
  if (minutes < 60) return `${minutes.toFixed(0)} min`
  const hours = minutes / 60
  return `${hours.toFixed(1)} h`
}

export function OrganizationStatsPanel() {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deptUsageView, setDeptUsageView] = useState<"day" | "week" | "month">("week")
  const [totalCountView, setTotalCountView] = useState<"day" | "week" | "month">("week")
  const [userRole, setUserRole] = useState<string | null>(null)
  const [orgOptions, setOrgOptions] = useState<OrgOption[]>([])
  const [selectedOrg, setSelectedOrg] = useState<string>("")
  const [selectedDept, setSelectedDept] = useState<string>("all")
  const isSuperAdmin = (userRole ?? "").toLowerCase() === "superadmin"

  const fetchOrganizations = useCallback(async () => {
    try {
      const res = await apiGet("/api/admin/org-structure")
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Error al obtener organizaciones")
      const list: OrgOption[] = Array.isArray(data.organizations) ? data.organizations : []
      setOrgOptions(list)
    } catch (err) {
      console.error("Error cargando organizaciones:", err)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    if (!userRole) return
    if (isSuperAdmin && !selectedOrg) return
    try {
      setIsLoading(true)
      setError(null)
      const params = new URLSearchParams()
      if (isSuperAdmin && selectedOrg && selectedOrg !== "all") {
        params.set("organizationId", selectedOrg)
        if (selectedDept !== "all") {
          params.set("departmentId", selectedDept)
        }
      }
      const query = params.toString()
      const res = await apiGet(`/api/statistics/overview${query ? `?${query}` : ""}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Error al obtener estadísticas")
      setStats(data)
    } catch (err) {
      console.error("Error cargando estadísticas organizacionales:", err)
      setError(err instanceof Error ? err.message : "No se pudieron cargar las estadísticas")
      setStats(null)
    } finally {
      setIsLoading(false)
    }
  }, [isSuperAdmin, selectedDept, selectedOrg, userRole])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiGet("/api/auth/me")
        if (!res.ok) throw new Error("No autenticado")
        const data = await res.json()
        const roleName = data?.user?.roleName || data?.user?.role || null
        setUserRole(roleName)
        if ((roleName ?? "").toLowerCase() === "superadmin") {
          setSelectedOrg("all")
          fetchOrganizations().catch(() => {})
        }
      } catch (err) {
        console.error("Error obteniendo usuario:", err)
        setUserRole(null)
      }
    }

    fetchUser().catch(() => {})
  }, [fetchOrganizations])

  useEffect(() => {
    fetchStats().catch(() => {})
  }, [fetchStats])

  useEffect(() => {
    if (!isSuperAdmin) return
    if (selectedOrg === "all") {
      setSelectedDept("all")
      return
    }
    const org = orgOptions.find((org) => org.id === selectedOrg)
    if (!org) {
      setSelectedDept("all")
      return
    }
    if (selectedDept !== "all" && !org.departments.some((dept) => dept.id === selectedDept)) {
      setSelectedDept("all")
    }
  }, [isSuperAdmin, orgOptions, selectedDept, selectedOrg])

  const selectedOrgData = useMemo(
    () => orgOptions.find((org) => org.id === selectedOrg),
    [orgOptions, selectedOrg]
  )

  const safeStats = stats ?? EMPTY_STATS
  const summary = safeStats.summary
  const departments = safeStats.departments
  const weeklyTrend = safeStats.weeklyTrend
  const dailyTrend = safeStats.dailyTrend
  const monthlyTrend = safeStats.monthlyTrend
  const topRatedExercises = safeStats.topRatedExercises

  const participation = summary.total_users > 0 ? (summary.active_users_week / summary.total_users) * 100 : 0
  const averageInterruptions =
    summary.active_users_week > 0 ? summary.total_pauses_week / summary.active_users_week : 0
  const hourImpactMonth = summary.month_minutes / 60
  const marathons = hourImpactMonth > 0 ? hourImpactMonth / 3.5 : 0
  const workDays = hourImpactMonth > 0 ? hourImpactMonth / 8 : 0
  const weeklyRecommendation = 15
  const weeklyProgress = Math.min(averageInterruptions / weeklyRecommendation, 1)

  const topDepartments = [...departments]
    .sort((a, b) => b.total_pauses_week - a.total_pauses_week)
    .slice(0, 5)

  const departmentUsageLabels = topDepartments.map((d) => d.department_name)
  const departmentUsageValues = topDepartments.map((d) => {
    if (deptUsageView === "day") {
      return Math.max(0, Math.round(d.total_pauses_week / 7))
    }
    if (deptUsageView === "month") {
      return d.total_pauses_month
    }
    return d.total_pauses_week
  })
  const departmentUsageLabel =
    deptUsageView === "day"
      ? "Pausas promedio por día"
      : deptUsageView === "month"
        ? "Pausas por mes"
        : "Pausas por semana"
  const departmentUsageChart = {
    labels: departmentUsageLabels,
    datasets: [
      {
        label: departmentUsageLabel,
        data: departmentUsageValues,
        backgroundColor: "#3b82f6",
        borderRadius: 6,
      },
    ],
  }

  const departmentSatisfactionChart = {
    labels: topDepartments.map((d) => d.department_name),
    datasets: [
      {
        label: "Satisfacción media",
        data: topDepartments.map((d) => Number(d.avg_satisfaction || 0)),
        backgroundColor: "#8AC5B5",
        borderRadius: 6,
      },
    ],
  }

  const weeklyTrendLabels = weeklyTrend.map((point) =>
    new Date(point.week_start).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })
  )

  const weeklyTrendData = {
    labels: weeklyTrendLabels,
    datasets: [
      {
        label: "Pausas totales",
        data: weeklyTrend.map((point) => point.sessions),
        fill: true,
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.15)",
        tension: 0.35,
        yAxisID: "y",
      },
      {
        label: "Satisfacción media",
        data: weeklyTrend.map((point) => Number(point.avg_satisfaction ?? 0)),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.15)",
        tension: 0.35,
        yAxisID: "y1",
      },
    ],
  }

  const weeklyTrendOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    interaction: { mode: "index", intersect: false },
    scales: {
      y: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        title: { display: true, text: "Pausas" },
      },
      y1: {
        type: "linear",
        position: "right",
        beginAtZero: true,
        min: 0,
        max: 5,
        title: { display: true, text: "Satisfacción (1-5)" },
        grid: { drawOnChartArea: false },
      },
    },
  }

  const totalCountChart = useMemo(() => {
    if (totalCountView === "day") {
      if (!dailyTrend.length) return null
      const labels = dailyTrend.map((point) =>
        new Date(point.day).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })
      )
      const values = dailyTrend.map((point) => point.sessions)
      return {
        axisLabel: "Pausas/día",
        chart: {
          labels,
          datasets: [
            {
              label: "Pausas por día",
              data: values,
              backgroundColor: "#2563eb",
              borderRadius: 6,
            },
          ],
        },
      }
    }

    if (totalCountView === "month") {
      if (!monthlyTrend.length) return null
      const labels = monthlyTrend.map((point) => {
        const date = new Date(`${point.month}-01`)
        return date.toLocaleDateString("es-ES", { month: "short", year: "numeric" })
      })
      const values = monthlyTrend.map((point) => point.sessions)
      return {
        axisLabel: "Pausas/mes",
        chart: {
          labels,
          datasets: [
            {
              label: "Pausas por mes",
              data: values,
              backgroundColor: "#2563eb",
              borderRadius: 6,
            },
          ],
        },
      }
    }

    if (!weeklyTrend.length) return null
    return {
      axisLabel: "Pausas/semana",
      chart: {
        labels: weeklyTrendLabels,
        datasets: [
          {
            label: "Pausas por semana",
            data: weeklyTrend.map((point) => point.sessions),
            backgroundColor: "#2563eb",
            borderRadius: 6,
          },
        ],
      },
    }
  }, [dailyTrend, monthlyTrend, totalCountView, weeklyTrend, weeklyTrendLabels])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de la organización</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">{error ?? "No se pudieron cargar los datos"}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Visión general</h2>
          <p className="text-sm text-gray-500">Actividad y bienestar del equipo en tu organización</p>
        </div>
        {isSuperAdmin && (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-gray-500">Organización</p>
              <select
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                value={selectedOrg || "all"}
                onChange={(e) => setSelectedOrg(e.target.value)}
              >
                <option value="all">Todas las organizaciones</option>
                {orgOptions.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedOrg && selectedOrg !== "all" && (
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-gray-500">Departamento</p>
                <select
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  <option value="all">Todos los departamentos</option>
                  {(selectedOrgData?.departments ?? []).map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Tasa de participación" value={formatPercent(participation)} icon={<UsersIcon className="h-5 w-5" />} />
        <StatCard title="Pausas (7 días)" value={formatNumber(summary.total_pauses_week)} icon={<ActivityIcon className="h-5 w-5" />} />
        <StatCard title="Pausas (30 días)" value={formatNumber(summary.total_pauses_month)} icon={<ActivityIcon className="h-5 w-5" />} />
        <StatCard
          title="Satisfacción general"
          value={`${summary.avg_satisfaction.toFixed(1)} / 5`}
          icon={<HeartIcon className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="space-y-2">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Uso por departamento</CardTitle>
                <CardDescription>
                  {deptUsageView === "day"
                    ? "Promedio diario (referencia últimos 7 días)"
                    : deptUsageView === "week"
                      ? "Pausas activas en los últimos 7 días"
                      : "Pausas acumuladas en los últimos 30 días"}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {(["day", "week", "month"] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setDeptUsageView(option)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                      deptUsageView === option
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {option === "day" ? "Día" : option === "week" ? "Semana" : "Mes"}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Bar
              data={departmentUsageChart}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text:
                        deptUsageView === "day"
                          ? "Pausas/día"
                          : deptUsageView === "month"
                            ? "Pausas/mes"
                            : "Pausas/semana",
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Satisfacción por departamento</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Bar
              data={departmentSatisfactionChart}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, min: 0, max: 5 } },
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tendencias en el tiempo</CardTitle>
            <CardDescription>Pausas totales y satisfacción semanal (últimas 8 semanas)</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            {weeklyTrend.length === 0 ? (
              <p className="text-sm text-gray-500">Aún no hay datos históricos suficientes.</p>
            ) : (
              <Line data={weeklyTrendData} options={weeklyTrendOptions} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-2">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Recuento de pausas</CardTitle>
                <CardDescription>
                  {totalCountView === "day"
                    ? "Totales diarios (últimos 30 días)"
                    : totalCountView === "week"
                      ? "Totales por semana (últimas 8 semanas)"
                      : "Totales por mes (últimos 12 meses)"}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {(["day", "week", "month"] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setTotalCountView(option)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                      totalCountView === option
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {option === "day" ? "Día" : option === "week" ? "Semana" : "Mes"}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[320px]">
            {totalCountChart ? (
              <Bar
                data={totalCountChart.chart}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: totalCountChart.axisLabel },
                    },
                  },
                }}
              />
            ) : (
              <p className="text-sm text-gray-500">Aún no hay recuentos disponibles.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sedentarismo interrumpido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-600">
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-emerald-600">Promedio semanal</p>
                  <p className="text-3xl font-semibold text-emerald-700">
                    {averageInterruptions.toFixed(1)}
                    <span className="ml-1 text-lg font-medium text-emerald-600">pausas</span>
                  </p>
                  <p className="text-xs text-gray-500">Objetivo recomendado: {weeklyRecommendation} pausas/semana</p>
                </div>
                <div className="flex-1 lg:pl-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Progreso hacia la recomendación
                  </p>
                  <div className="h-2 rounded-full bg-emerald-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${Math.max(weeklyProgress * 100, 4)}%` }}
                    />
                  </div>
                  <div className="mt-1 text-right text-xs text-gray-500">{Math.round(weeklyProgress * 100)}%</div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs uppercase tracking-wide text-gray-500">Salud ganada en 7 días</p>
                <p className="text-2xl font-semibold text-gray-900">{formatHours(summary.week_minutes)}</p>
                <p className="text-xs text-gray-500">equivalente a {(summary.week_minutes / 30).toFixed(1)} sesiones express</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs uppercase tracking-wide text-gray-500">Impacto mensual acumulado</p>
                <p className="text-2xl font-semibold text-gray-900">{formatHours(summary.month_minutes)}</p>
                <p className="text-xs text-gray-500">
                  ~ {marathons.toFixed(1)} maratones o {workDays.toFixed(1)} días de trabajo en movimiento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ranking de pausas mejor valoradas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topRatedExercises.length === 0 ? (
              <p className="text-sm text-gray-500">Todavía no hay suficientes valoraciones.</p>
            ) : (
              topRatedExercises.map((exercise) => (
                <div
                  key={exercise.title + (exercise.wistia_id ?? "")}
                  className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-2"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{exercise.title}</p>
                    <p className="text-xs text-gray-500">
                      {exercise.ratings} valoraciones · {exercise.avg_satisfaction.toFixed(1)}/5
                    </p>
                  </div>
                  <Award className="h-5 w-5 text-yellow-500" />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <div className="text-emerald-500">{icon}</div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}
