"use client"

import Cookies from "js-cookie"
import React, { useEffect, useMemo, useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  ActivityIcon,
  ArrowDown01Icon,
  CalendarDaysIcon,
  ClockIcon,
  FlameIcon,
  HeartIcon,
  LightbulbIcon,
  SmileIcon,
  TrendingUpIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler)

interface StatisticsData {
  summary: {
    total_exercises: number
    distinct_days: number
    weekly_sessions: number
    avg_satisfaction: number
  }
  category_distribution: {
    category: string
    total_sessions: number
  }[]
  activity_timeline: {
    day: string
    sessions: number
  }[]
  weekly_pattern: {
    day_of_week: string
    sessions: number
  }[]
  hourly_pattern: {
    time_slot: string
    sessions: number
  }[]
  insights: string[]
  favorite_videos: {
    title: string
    wistia_id: string | null
    total_sessions: number
  }[]
  weekly_comparison: {
    week_start: string
    sessions: number
  }[]
  time_summary: {
    week_minutes: number
    month_minutes: number
  }
}

type Streaks = {
  current: number
  best: number
}

const DAY_MS = 24 * 60 * 60 * 1000
const dayTranslations: Record<string, string> = {
  monday: "lunes",
  tuesday: "martes",
  wednesday: "miércoles",
  thursday: "jueves",
  friday: "viernes",
  saturday: "sábado",
  sunday: "domingo",
}

const translateDayName = (value?: string | null) => {
  if (!value) return "Sin dato"
  const key = value.trim().toLowerCase()
  return dayTranslations[key] ? dayTranslations[key] : value.trim()
}

const translateInsight = (text?: string) => {
  if (!text) return ""
  let result = text
  Object.entries(dayTranslations).forEach(([en, es]) => {
    const regex = new RegExp(en, "ig")
    result = result.replace(regex, es)
  })
  return result
}

const calculateStreaks = (timeline: StatisticsData["activity_timeline"]): Streaks => {
  if (!timeline?.length) return { current: 0, best: 0 }

  const sorted = [...timeline]
    .filter((entry) => entry.sessions > 0)
    .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime())
  if (!sorted.length) return { current: 0, best: 0 }

  let best = 0
  let running = 0
  let lastDate: Date | null = null

  sorted.forEach((entry) => {
    const date = new Date(entry.day)
    if (!lastDate) {
      running = 1
    } else {
      const diff = Math.round((date.getTime() - lastDate.getTime()) / DAY_MS)
      running = diff === 1 ? running + 1 : 1
    }
    best = Math.max(best, running)
    lastDate = date
  })

  let current = 0
  if (lastDate) {
    const lastDateValue = lastDate as Date
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const lastStart = new Date(lastDateValue.getFullYear(), lastDateValue.getMonth(), lastDateValue.getDate())
    const diff = Math.round((todayStart.getTime() - lastStart.getTime()) / DAY_MS)
    if (diff <= 1) {
      current = running
    }
  }

  return { current, best }
}

const formatMinutes = (minutes: number) => {
  if (!minutes) return "0 min"
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return `${hours} h${remainder > 0 ? ` ${remainder} min` : ""}`
}

const formatWeekLabel = (weekStart: string) => {
  const date = new Date(weekStart)
  return `Semana ${date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}`
}

const resolveCategoryColor = (value: string) => {
  const label = value.toLowerCase()
  if (label.includes("movilidad")) return "#7E2FF5"
  if (label.includes("cervical")) return "#f59e0b"
  if (label.includes("core")) return "#DE87D5"
  if (label.includes("cardio")) return "#ef4444"
  if (label.includes("fuerza") && label.includes("superior")) return "#3b82f6"
  if (label.includes("fuerza") && label.includes("inferior")) return "#10b981"
  if (label.includes("miembro inferior")) return "#10b981"
  if (label.includes("miembro superior")) return "#3b82f6"
  return "#94a3b8"
}

export function StatisticsDashboard() {
  const router = useRouter()
  const [data, setData] = useState<StatisticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comparisonView, setComparisonView] = useState<"days" | "weeks" | "months">("weeks")

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = Cookies.get("accessToken")
        if (!token) {
          setError("Usuario no autenticado")
          setIsLoading(false)
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/statistics`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        })

        if (!response.ok) throw new Error(`Error del servidor: ${response.status}`)
        const json = await response.json()
        setData(json)
      } catch (err) {
        console.error("Error al obtener estadísticas:", err)
        setError("No se pudieron cargar las estadísticas")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatistics()
  }, [])

  const streaks = useMemo(() => {
    if (!data) return { current: 0, best: 0 }
    return calculateStreaks(data.activity_timeline)
  }, [data])

  const timeSummary = useMemo(() => {
    return data?.time_summary ?? { week_minutes: 0, month_minutes: 0 }
  }, [data])

  const comparisonData = useMemo(() => {
    if (!data) return []
    if (comparisonView === "days") {
      return [...(data.activity_timeline ?? [])]
        .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime())
        .slice(-7)
        .map((entry) => ({
          label: new Date(entry.day).toLocaleDateString("es-ES", { day: "2-digit", month: "short" }),
          value: entry.sessions,
        }))
    }

    if (comparisonView === "months") {
      const map = new Map<string, { label: string; value: number; sortKey: number }>()
      ;(data.activity_timeline ?? []).forEach((entry) => {
        const date = new Date(entry.day)
        const key = `${date.getFullYear()}-${date.getMonth()}`
        const label = date.toLocaleDateString("es-ES", { month: "short", year: "numeric" })
        const current = map.get(key) ?? { label, value: 0, sortKey: date.getTime() }
        current.value += entry.sessions
        map.set(key, current)
      })
      return Array.from(map.values())
        .sort((a, b) => a.sortKey - b.sortKey)
        .slice(-6)
        .map(({ label, value }) => ({ label, value }))
    }

    // weeks
    return [...(data.weekly_comparison ?? [])]
      .slice(-8)
      .map((point) => ({
        label: formatWeekLabel(point.week_start),
        value: point.sessions,
      }))
  }, [data, comparisonView])

  const comparisonChartData = useMemo(() => {
    return {
      labels: comparisonData.map((item) => item.label),
      datasets: [
        {
          label:
            comparisonView === "days"
              ? "Sesiones diarias"
              : comparisonView === "months"
                ? "Sesiones mensuales"
                : "Sesiones semanales",
          data: comparisonData.map((item) => item.value),
          backgroundColor: "#8AC5B5",
          borderRadius: 10,
        },
      ],
    }
  }, [comparisonData, comparisonView])

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          ))}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <h1 className="text-xl font-bold mb-2">Error</h1>
        <p>{error}</p>
      </div>
    )
  }

  if (!data || data.summary.total_exercises === 0) {
    return (
      <div className="p-8 bg-teal-50 rounded-2xl text-center max-w-2xl mx-auto border border-teal-100 shadow-sm">
        <ActivityIcon className="h-16 w-16 mx-auto text-[#8AC5B5] mb-4" />
        <h1 className="text-2xl font-bold mb-3 text-teal-800">¡Comienza tu viaje de ejercicios!</h1>
        <p className="text-teal-600 mb-5 max-w-md mx-auto">
          Completa tu primera sesión para desbloquear estadísticas detalladas
        </p>
        <div className="space-y-4">
          <div className="animate-bounce">
            <ArrowDown01Icon className="h-8 w-8 mx-auto text-[#8AC5B5]" />
          </div>
          <button
            className="px-6 py-3 bg-[#8AC5B5] hover:bg-teal-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center mx-auto space-x-2 justify-center"
            onClick={() => router.push("/notifications")}
          >
            <span>Iniciar Ejercicio</span>
          </button>
        </div>
      </div>
    )
  }

  const favoriteVideos = data.favorite_videos ?? []

  return (
    <div className="space-y-10 p-4 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tu progreso</h1>
        <p className="text-sm text-gray-500">Resumen personalizado de tu actividad reciente</p>
      </div>

      {data.insights?.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <LightbulbIcon className="h-5 w-5 text-yellow-500" /> Insights
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            {data.insights.map((insight, index) => (
              <li key={index}>{translateInsight(insight)}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Pausas completadas" value={data.summary.total_exercises} unit="totales" />
        <StatCard title="Pausas esta semana" value={data.summary.weekly_sessions} unit="sesiones" />
        <StatCard
          title="Días activos"
          value={data.summary.distinct_days}
          unit="días"
          icon={<CalendarDaysIcon className="h-5 w-5 text-blue-500" />}
        />
        <StatCard
          title="Racha actual"
          value={streaks.current}
          unit="días"
          icon={<FlameIcon className="h-5 w-5 text-orange-500" />}
        />
        <StatCard
          title="Récord histórico"
          value={streaks.best}
          unit="días"
          icon={<TrendingUpIcon className="h-5 w-5 text-emerald-500" />}
        />
        <StatCard
          title="Satisfacción media"
          value={data.summary.avg_satisfaction}
          unit="/5"
          icon={<SmileIcon className="h-5 w-5 text-amber-500" />}
        />
        <StatCard
          title="Tiempo activo (7 días)"
          value={formatMinutes(timeSummary.week_minutes)}
          unit=""
          icon={<ClockIcon className="h-5 w-5 text-indigo-500" />}
          subtitle={`Últimos 30 días: ${formatMinutes(timeSummary.month_minutes)}`}
        />
      </div>

      <PersonalImpactCard weekMinutes={timeSummary.week_minutes} monthMinutes={timeSummary.month_minutes} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Reparto por categorías" subtitle="Los tipos de ejercicios que más repites">
          <Bar
            data={{
              labels: data.category_distribution.map((d) => d.category),
              datasets: [
                {
                  label: "Sesiones completadas",
                  data: data.category_distribution.map((d) => d.total_sessions),
                  backgroundColor: data.category_distribution.map((d) =>
                    resolveCategoryColor(d.category)
                  ),
                  borderRadius: 8,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, title: { display: true, text: "Número de sesiones" } },
                x: { title: { display: true, text: "Categoría" } },
              },
            }}
          />
        </ChartCard>

        <ChartCard
          title="Comparación personal"
          subtitle="Visualiza tu actividad por días, semanas o meses"
          action={
            <div className="flex gap-2 flex-wrap">
              {(["days", "weeks", "months"] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setComparisonView(view)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm border capitalize",
                    comparisonView === view
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "text-gray-600 border-gray-200 hover:bg-gray-100"
                  )}
                >
                  {view === "days" ? "Días" : view === "weeks" ? "Semanas" : "Meses"}
                </button>
              ))}
            </div>
          }
        >
          {comparisonData.length === 0 ? (
            <p className="text-sm text-gray-500">Aún no hay suficientes datos.</p>
          ) : (
            <Bar
              data={comparisonChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { title: { display: true, text: comparisonView === "days" ? "Día" : comparisonView === "weeks" ? "Semana" : "Mes" } },
                  y: { beginAtZero: true, title: { display: true, text: "Sesiones" } },
                },
              }}
            />
          )}
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Actividad semanal" subtitle="Distribución de sesiones por día de la semana">
          <Bar
            data={{
              labels: data.weekly_pattern.map((d) => translateDayName(d.day_of_week)),
              datasets: [
                {
                  label: "Sesiones",
                  data: data.weekly_pattern.map((d) => d.sessions ?? 0),
                  backgroundColor: "#3b82f6",
                  borderRadius: 8,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, title: { display: true, text: "Sesiones" } },
                x: { title: { display: true, text: "Día" } },
              },
            }}
          />
        </ChartCard>

        <ChartCard title="Actividad por franja horaria" subtitle="Cuándo sueles entrenar">
          <Bar
            data={{
              labels: data.hourly_pattern.map((d) => d.time_slot),
              datasets: [
                {
                  label: "Sesiones",
                  data: data.hourly_pattern.map((d) => d.sessions),
                  backgroundColor: "#f59e0b",
                  borderRadius: 8,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, title: { display: true, text: "Sesiones" } },
                x: { title: { display: true, text: "Franja horaria" } },
              },
            }}
          />
        </ChartCard>
      </div>

      <FavoriteVideos videos={favoriteVideos} />
    </div>
  )
}

function StatCard({
  title,
  value,
  unit,
  icon,
  subtitle,
}: {
  title: string
  value: number | string
  unit?: string
  icon?: React.ReactNode
  subtitle?: string
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900">
        {value}
        {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
      </p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  )
}

function ChartCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="h-[320px] relative">{children}</div>
    </div>
  )
}

function PersonalImpactCard({ weekMinutes, monthMinutes }: { weekMinutes: number; monthMinutes: number }) {
  const weekHours = weekMinutes / 60
  const monthHours = monthMinutes / 60
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-3">
      <h2 className="text-xl font-semibold text-gray-900">Impacto acumulado personal</h2>
      <p className="text-sm text-gray-500">
        Tiempo total que has invertido en tu bienestar en la última semana y mes.
      </p>
      <div className="flex flex-wrap gap-6 text-sm text-gray-700">
        <div>
          <p className="text-2xl font-semibold text-emerald-600">{formatMinutes(weekMinutes)}</p>
          <p>Ganados esta semana</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-indigo-600">{formatMinutes(monthMinutes)}</p>
          <p>Acumulados en los últimos 30 días</p>
        </div>
      </div>
      <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
        <li>Equivalente a {(weekHours / 0.5).toFixed(1)} sesiones breves de movimiento.</li>
        <li>En un mes sumas aproximadamente {monthHours.toFixed(1)} horas de actividad saludable.</li>
      </ul>
    </div>
  )
}

function FavoriteVideos({ videos }: { videos: StatisticsData["favorite_videos"] }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <HeartIcon className="h-5 w-5 text-rose-500" /> Ejercicios más frecuentes
      </h2>
      {videos.length === 0 ? (
        <p className="text-sm text-gray-500">Aún no hay suficientes datos para mostrar tus vídeos más repetidos.</p>
      ) : (
        <div className="space-y-3">
          {videos.map((video) => (
            <div
              key={`${video.title}-${video.wistia_id}`}
              className="flex items-center gap-4 rounded-xl border border-gray-100 px-4 py-3 bg-gray-50"
            >
              <div className="w-20 h-16 flex-shrink-0 overflow-hidden rounded-lg bg-white border border-gray-200">
                {video.wistia_id ? (
                  // Wistia swatch url
                  <img
                    src={`https://fast.wistia.com/embed/medias/${video.wistia_id}/swatch?image_crop_resized=320x180`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Sin vista previa</div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{video.title}</p>
                <p className="text-xs text-gray-500">
                  {video.total_sessions} {video.total_sessions === 1 ? "repetición" : "repeticiones"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
