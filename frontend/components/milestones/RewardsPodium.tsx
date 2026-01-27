"use client"

import { RankingUser } from "./UserRanking"
import { cn } from "@/lib/utils"
import { Trophy } from "lucide-react"

export type PodiumReward = {
  title: string
  description?: string | null
  image_url?: string | null
  cta_url?: string | null
}

type RewardsPodiumProps = {
  users: RankingUser[]
  rewards?: Record<number, PodiumReward | undefined>
  scopeLabel?: string
  loading?: boolean
}

const podiumLayout = [
  {
    place: 2,
    colors: { card: "bg-slate-100", accent: "text-slate-500", border: "border-slate-200" },
    height: "min-h-[240px]",
  },
  {
    place: 1,
    colors: { card: "bg-amber-100", accent: "text-amber-600", border: "border-amber-200" },
    height: "min-h-[300px]",
  },
  {
    place: 3,
    colors: { card: "bg-orange-100", accent: "text-orange-600", border: "border-orange-200" },
    height: "min-h-[220px]",
  },
]

const placeholderUser: RankingUser = {
  id: "placeholder",
  first_name: "Por definir",
  last_name: "",
  avatar_url: null,
  periodical_exp: 0,
}

export function RewardsPodium({ users, rewards, scopeLabel, loading = false }: RewardsPodiumProps) {
  const podiumUsers = [...users].slice(0, 3)
  while (podiumUsers.length < 3) podiumUsers.push(placeholderUser)

  return (
    <section className="rounded-[32px] bg-gradient-to-br from-white via-emerald-50 to-emerald-100/30 p-8 shadow-xl border border-emerald-100">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-100 pb-4">
        <div className="space-y-1">
          <p className="text-[10px] tracking-[0.4em] uppercase text-emerald-500 font-semibold">
            Podio temporada
          </p>
          <h2 className="text-2xl font-bold text-gray-900">Top Activos</h2>
          {scopeLabel && <p className="text-sm text-gray-500">{scopeLabel}</p>}
        </div>
        <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
          <Trophy className="h-5 w-5" />
          <span>Recompensa especial para el Top 3</span>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end">
        {podiumLayout.map(({ place, colors, height }, index) => {
          const podiumIndex = place - 1
          const user = podiumUsers[podiumIndex]
          const reward = rewards?.[place]
          const isPlaceholder = user.id === "placeholder"

          return (
            <div key={`${user.id}-${place}`} className={cn("flex flex-col justify-end", index === 1 && "md:translate-y-[-20px]")}>
              <div className={cn("rounded-3xl border p-4 shadow-sm", colors.card, colors.border, height, "flex flex-col justify-between")}>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <span className={colors.accent}>{place}º lugar</span>
                    {!isPlaceholder && <span className="text-gray-400">+{user.periodical_exp} XP</span>}
                  </div>
                  {reward ? (
                    <div className="rounded-2xl bg-white/80 p-3 text-center text-xs text-gray-700 shadow">
                      {reward.image_url && (
                        <div className="mb-3 flex items-center justify-center">
                          <img
                            src={reward.image_url}
                            alt={reward.title}
                            className="h-28 w-full rounded-xl object-contain bg-white"
                          />
                        </div>
                      )}
                      <p className="text-sm font-semibold text-gray-900">{reward.title}</p>
                      {reward.description && (
                        <p className="mt-1 text-[11px] text-gray-500 line-clamp-2">{reward.description}</p>
                      )}
                      {reward.cta_url && (
                        <a
                          href={reward.cta_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-block rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-white hover:bg-emerald-600"
                        >
                          Ver más
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-300 p-3 text-center text-xs text-gray-500">
                      Recompensa pendiente
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-col items-center text-center">
                  {isPlaceholder ? (
                    <div className="text-xs text-gray-400">Aún sin ganador</div>
                  ) : (
                    <>
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.first_name}
                          className="mb-2 h-12 w-12 rounded-full object-cover shadow"
                        />
                      ) : (
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/60 text-sm font-semibold text-gray-500 shadow">
                          {user.first_name?.charAt(0) || user.last_name?.charAt(0) || "?"}
                        </div>
                      )}
                      <p className="text-sm font-semibold text-gray-900">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-gray-500">+{user.periodical_exp} XP</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {loading && <div className="mt-6 text-center text-sm text-gray-500">Cargando clasificaciones...</div>}
    </section>
  )
}
