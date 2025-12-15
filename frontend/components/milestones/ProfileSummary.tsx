'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import { Progress } from "@/components/ui/progressProfile"
import { Skeleton } from "@/components/ui/skeleton"
import { usePerfilResumenRef } from "@/context/useProfileSummaryRef"
import { getLevelStateFromXP, getTitleFromLevel } from "@/lib/exp"
import StreakPopup from "@/components/animations/StreakPopup"
import { apiGet } from "@/lib/apiClient"

type PerfilData = {
  name: string
  nivel: number
  puntos: number
  logros: number
  progreso: number
  titulo: string
  racha: number
  avatarUrl?: string
}

type SummaryResponse = {
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  avatarUrl?: string | null
  exp?: number
  achievements?: number
  streak?: number
  celebrate?: boolean
  streakJustHit?: number | null
}

type XpLog = {
  id: string
  points: number
  action_type?: string | null
  created_at?: string | null
  metadata?: Record<string, any> | null
}

const XP_SOURCE_META: Record<string, { icon: string; title: string; fallbackDetail?: string }> = {
  active_pause: { icon: "💪", title: "Pausa activa" },
  pause: { icon: "💪", title: "Pausa activa" },
  achievement: { icon: "🏅", title: "Logro reclamado" },
  weekly_challenge: { icon: "🎯", title: "Reto semanal" },
  questionnaire: { icon: "📝", title: "Cuestionario" },
  xp_gain: { icon: "✨", title: "XP" },
}

const resolveXpEntryInfo = (log: XpLog) => {
  const meta = log.metadata ?? {}
  const sourceKey = (meta.source || log.action_type || "xp_gain") as string
  const base = XP_SOURCE_META[sourceKey] ?? XP_SOURCE_META["xp_gain"]

  let detail = base.fallbackDetail ?? ""
  if (Array.isArray(meta.videos) && meta.videos.length) {
    detail =
      meta.videos
        .map((v: any) => v?.title)
        .filter(Boolean)
        .slice(0, 2)
        .join(" · ") || detail
  }

  if (sourceKey === "achievement") {
    detail = meta.achievement_title || meta.achievement_id || detail || "Logro"
  } else if (sourceKey === "weekly_challenge") {
    detail = meta.challenge_title || meta.challenge_id || detail || "Reto semanal"
  } else if (sourceKey === "questionnaire") {
    detail = meta.questionnaire_title || meta.questionnaire_id || detail || "Cuestionario"
  } else if (sourceKey === "active_pause" || sourceKey === "pause") {
    detail = detail || "Rutina diaria"
  } else if (meta.description) {
    detail = meta.description
  }

  const date =
    log.created_at && !Number.isNaN(Date.parse(log.created_at))
      ? new Date(log.created_at)
      : null

  const resolvedIcon =
    meta.icon ||
    (sourceKey === "achievement" ? meta.achievement_icon : null) ||
    (sourceKey === "weekly_challenge" ? meta.challenge_icon : null) ||
    base.icon

  return {
    icon: resolvedIcon,
    title: meta.label || base.title,
    detail,
    date,
  }
}

export function PerfilResumen() {
  const [perfil, setPerfil] = useState<PerfilData | null>(null)
  const [showStreakCelebration, setShowStreakCelebration] = useState(false)
  const [streakJustHit, setStreakJustHit] = useState<number | null>(null)
  const [xpHistory, setXpHistory] = useState<XpLog[]>([])
  const [showXpModal, setShowXpModal] = useState(false)
  const ref = usePerfilResumenRef()

  useEffect(() => {
    let active = true

    const fetchSummary = async () => {
      try {
        const res = await apiGet("/api/milestones/summary")
        const data: SummaryResponse = await res.json()

        if (!res.ok) {
          console.error("Error al obtener resumen de hitos:", data)
          return
        }

        if (!active) return

        const exp = Number(data.exp ?? 0)
        const { level, progress } = getLevelStateFromXP(exp)
        const titulo = getTitleFromLevel(level)
        const nombre =
          data.firstName && data.lastName
            ? `${data.firstName} ${data.lastName}`
            : data.email || "Usuario"

        setPerfil({
          name: nombre,
          nivel: level,
          puntos: exp,
          logros: Number(data.achievements ?? 0),
          progreso: progress,
          titulo,
          racha: Number(data.streak ?? 0),
          avatarUrl: data.avatarUrl || undefined,
        })

        setShowStreakCelebration(Boolean(data.celebrate))
        setStreakJustHit(data.streakJustHit ?? null)
      } catch (error) {
        console.error("Error al cargar perfil de hitos:", error)
      }
    }

    const fetchXp = async () => {
      try {
        const res = await apiGet("/api/xp/history?limit=50")
        const data = await res.json()
        if (!res.ok) {
          console.error("Error al obtener historial de XP:", data)
          return
        }
        if (!active) return

        const logs: XpLog[] = Array.isArray(data?.history)
          ? data.history.map((item: any) => ({
              id: String(item.id ?? crypto.randomUUID()),
              points: Number(item.points ?? 0),
              action_type: item.action_type,
              created_at: item.created_at,
              metadata: item.metadata ?? {},
            }))
          : []
        setXpHistory(logs)
      } catch (error) {
        console.error("Error al cargar historial de XP:", error)
      }
    }

    fetchSummary()
    fetchXp()

    return () => {
      active = false
    }
  }, [])

  if (!perfil) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </div>
    )
  }

  return (
    <>
      <div
        ref={ref}
        className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 sm:p-7 lg:p-8 max-w-5xl mx-auto"
      >
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-4 items-center">
          {/* Col 1: avatar + nombre + titulo */}
          <div className="flex items-center gap-4 min-w-0">
            <Image
              src={perfil.avatarUrl || "/default-avatar.png"}
              alt="Avatar"
              width={64}
              height={64}
              className="rounded-full border border-gray-200 shrink-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/default-avatar.png"
              }}
            />
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-gray-900 break-words leading-tight">
                Hola, {perfil.name}
              </h2>
              <p className="text-sm text-gray-600">{perfil.puntos} PA</p>
              <p className="text-sm text-gray-500 truncate">
                {perfil.titulo}
              </p>
            </div>
          </div>

          {/* Col 2: nivel + barra de experiencia */}
          <div className="flex flex-col items-center gap-3 lg:border-x lg:border-gray-100 lg:px-4">
            <div className="text-xs uppercase tracking-[0.14em] text-emerald-700 font-semibold">
              Nivel actual
            </div>
            <div className="flex items-center justify-center w-20 h-14 rounded-2xl border border-emerald-200 bg-emerald-50 text-2xl font-bold text-emerald-700 shadow-sm">
              {perfil.nivel}
            </div>
            <div className="w-full max-w-xs">
              <div className="rounded-full bg-gray-200 h-6 sm:h-7 flex items-center overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#8ACC9F]"
                  style={{ width: `${perfil.progreso}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Progreso al siguiente nivel: {perfil.progreso}%
              </p>
            </div>
          </div>

          {/* Col 3: racha y logros */}
          <div className="flex flex-col items-center justify-center gap-3 text-center lg:border-r lg:border-gray-100 lg:px-4">
            <div className="text-sm text-gray-600">Racha</div>
            <div className="text-4xl font-bold text-emerald-600 leading-tight">
              {perfil.racha}
            </div>
            <div className="text-xs text-gray-500">dias consecutivos</div>
            <div className="text-sm text-gray-600">
              Logros: <span className="font-semibold text-gray-900">{perfil.logros}</span>
            </div>
          </div>

          {/* Col 4: historial XP compacto */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-900">Historial XP</p>
              {xpHistory.length > 0 && (
                <button
                  onClick={() => setShowXpModal(true)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline-offset-2"
                >
                  Ver más
                </button>
              )}
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3 space-y-2">
              {xpHistory.slice(0, 3).map((item) => {
                const info = resolveXpEntryInfo(item)
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-3 py-2 shadow-sm"
                  >
                    <div className="text-lg">{info.icon}</div>
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="flex items-center justify-between font-semibold text-gray-900">
                        <span className="truncate">{info.title}</span>
                        <span className="text-emerald-600">+{item.points} PA</span>
                      </div>
                      {info.detail && (
                        <p className="mt-0.5 truncate text-[11px] text-gray-500">{info.detail}</p>
                      )}
                    </div>
                  </div>
                )
              })}
              {xpHistory.length === 0 && (
                <p className="text-xs text-gray-500">Sin movimientos recientes</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <StreakPopup
        open={showStreakCelebration}
        streak={streakJustHit ?? 0}
        onClose={() => setShowStreakCelebration(false)}
        autoCloseMs={2200}
        subtitle="Sigue asi, estas on fire!"
      />

      {showXpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Historial completo</h3>
              <button
                onClick={() => setShowXpModal(false)}
                className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Cerrar
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto space-y-3 pr-1">
              {xpHistory.length === 0 ? (
                <p className="text-sm text-gray-500">Sin movimientos recientes</p>
              ) : (
                xpHistory.map((item) => {
                  const info = resolveXpEntryInfo(item)
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{info.icon}</div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{info.title}</p>
                          {info.detail && (
                            <p className="text-xs text-gray-500">{info.detail}</p>
                          )}
                          {info.date && (
                            <p className="text-[11px] text-gray-400">
                              {info.date.toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-emerald-600">
                        +{item.points} PA
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
