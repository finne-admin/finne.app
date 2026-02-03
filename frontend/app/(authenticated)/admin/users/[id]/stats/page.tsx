"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiGet } from "@/lib/apiClient"
import { SvelteUserStatsPanel } from "@/components/svelte/SvelteUserStatsPanel"

interface UserStatsSummary {
  total_exercises: number
  distinct_days: number
  weekly_sessions: number
  avg_satisfaction: number
}

type XpLog = {
  id: string
  points: number
  action_type?: string | null
  created_at?: string | null
  metadata?: Record<string, any> | null
}

interface UserStatsResponse {
  summary: UserStatsSummary
  category_distribution: { category: string; total_sessions: number }[]
  activity_timeline: { day: string; sessions: number }[]
  weekly_pattern: { day_of_week: string; sessions: number }[]
  hourly_pattern: { time_slot: string; sessions: number }[]
  insights: string[]
  favorite_videos: { title: string; wistia_id: string | null; total_sessions: number }[]
  weekly_comparison: { week_start: string; sessions: number }[]
  time_summary: { week_minutes: number; month_minutes: number }
  weeklyActiveDays?: number[]
  xpHistory?: XpLog[]
  xpTotal?: number
}

 

export default function AdminUserStatsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = params?.id ?? ""
  const name = searchParams.get("name") ?? "Usuario"
  const email = searchParams.get("email") ?? ""

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [data, setData] = useState<UserStatsResponse | null>(null)
  const [xpLimit, setXpLimit] = useState(10)
  const [xpOffset, setXpOffset] = useState(0)
  const [xpFrom, setXpFrom] = useState<string>("")
  const [xpTo, setXpTo] = useState<string>("")

  useEffect(() => {
    if (!userId) return
    let active = true
    const loadStats = async () => {
      if (!data) {
        setLoading(true)
      }
      setError("")
      try {
        const params = new URLSearchParams()
        params.set("xpLimit", String(xpLimit))
        params.set("xpOffset", String(xpOffset))
        if (xpFrom) params.set("xpFrom", xpFrom)
        if (xpTo) params.set("xpTo", xpTo)
        const res = await apiGet(`/api/statistics/users/${userId}?${params.toString()}`)
        const payload = await res.json()
        if (!res.ok) {
          throw new Error(payload?.error || "Error al obtener estadísticas")
        }
        if (active) {
          setData((prev) => {
            if (!prev || xpOffset === 0) return payload
            const merged = {
              ...payload,
              xpHistory: [...(prev.xpHistory ?? []), ...(payload.xpHistory ?? [])],
            }
            return merged
          })
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "No se pudieron cargar las estadísticas")
        }
      } finally {
        if (active && !data) setLoading(false)
      }
    }
    loadStats()
    return () => {
      active = false
    }
  }, [userId, xpLimit, xpOffset, xpFrom, xpTo])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.customElements?.get("svelte-user-stats-panel")) {
      setSvelteReady(true)
      return
    }
    const script = document.createElement("script")
    script.type = "module"
    script.src = "/svelte/svelte-lab.js"
    script.onload = () => setSvelteReady(true)
    script.onerror = () => setSvelteReady(false)
    document.head.appendChild(script)
    return () => {
      script.remove()
    }
  }, [])

  const handleXpFilter = (range: { from: string; to: string }) => {
    setXpOffset(0)
    setXpFrom(range.from)
    setXpTo(range.to)
  }

  const handleXpLoadMore = (nextOffset: number) => {
    setXpOffset(nextOffset)
  }

  const summaryPayload = useMemo(() => {
    if (!data) return ""
    return JSON.stringify(data.summary ?? {})
  }, [data])
  const timePayload = useMemo(() => {
    if (!data) return ""
    return JSON.stringify(data.time_summary ?? {})
  }, [data])
  const weeklyPayload = useMemo(() => {
    if (!data) return ""
    return JSON.stringify(data.weeklyActiveDays ?? [])
  }, [data])
  const xpPayload = useMemo(() => {
    if (!data) return ""
    return JSON.stringify(data.xpHistory ?? [])
  }, [data])
  const categoryPayload = useMemo(() => {
    if (!data) return ""
    return JSON.stringify(data.category_distribution ?? [])
  }, [data])
  const favoritePayload = useMemo(() => {
    if (!data) return ""
    return JSON.stringify(data.favorite_videos ?? [])
  }, [data])
  const insightsPayload = useMemo(() => {
    if (!data) return ""
    return JSON.stringify(data.insights ?? [])
  }, [data])
  const [svelteReady, setSvelteReady] = useState(false)
  const xpTotal = data?.xpTotal ?? 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Volver
            </Button>
            <Link href="/admin">
              <Button variant="ghost">Panel admin</Button>
            </Link>
          </div>
        </header>

        {loading && !data && (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Cargando estadísticas...
          </div>
        )}

        {!data && error && (
          <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {data && (
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            {svelteReady ? (
              <SvelteUserStatsPanel
                name={name}
                email={email}
                summary={summaryPayload}
                timeSummary={timePayload}
                weeklyActiveDays={weeklyPayload}
                xpHistory={xpPayload}
                categoryDistribution={categoryPayload}
                favoriteVideos={favoritePayload}
                insights={insightsPayload}
                xpTotal={xpTotal}
                xpLimit={xpLimit}
                xpOffset={xpOffset}
                xpFrom={xpFrom}
                xpTo={xpTo}
                onXpFilter={handleXpFilter}
                onXpLoadMore={handleXpLoadMore}
                scriptReady={svelteReady}
              />
            ) : (
              <div className="flex items-center justify-center gap-2 py-10 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Cargando panel interactivo...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
