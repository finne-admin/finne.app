"use client"

import { RankingUser } from "./UserRanking"
import { Gift, Sparkles, Trophy } from "lucide-react"

export type RewardKey = "guaranteed_winner" | "raffle_a" | "raffle_b"

export type PodiumReward = {
  reward_key?: RewardKey
  title: string
  description?: string | null
  image_url?: string | null
  cta_url?: string | null
}

export type RewardsMap = Partial<Record<RewardKey, PodiumReward | undefined>>
export type RewardMode = "classic_top3" | "raffle_thresholds"

export type RaffleThreshold = {
  id: string
  organization_id: string
  min_points: number
  entries_count: number
  active: boolean
}

type RewardsPodiumProps = {
  users: RankingUser[]
  rewards?: RewardsMap
  rewardMode?: RewardMode
  raffleThresholds?: RaffleThreshold[]
  userRaffleEntries?: number
  scopeLabel?: string
  loading?: boolean
}

const placeholderUser: RankingUser = {
  id: "placeholder",
  first_name: "Por definir",
  last_name: "",
  avatar_url: null,
  periodical_exp: 0,
}

const raffleRewardMeta: Array<{ key: RewardKey; label: string }> = [
  { key: "raffle_a", label: "Sorteo A" },
  { key: "raffle_b", label: "Sorteo B" },
]

export function RewardsPodium({
  users,
  rewards,
  rewardMode = "raffle_thresholds",
  raffleThresholds = [],
  userRaffleEntries = 0,
  scopeLabel,
  loading = false,
}: RewardsPodiumProps) {
  const podiumUsers = [...users].slice(0, 1)
  while (podiumUsers.length < 1) podiumUsers.push(placeholderUser)
  const winner = podiumUsers[0]
  const guaranteedReward = rewards?.guaranteed_winner
  const classicRewardByPlace: Record<number, PodiumReward | undefined> = {
    1: rewards?.guaranteed_winner,
    2: rewards?.raffle_a,
    3: rewards?.raffle_b,
  }
  const activeThresholds = [...raffleThresholds]
    .filter((threshold) => threshold.active)
    .sort((a, b) => a.min_points - b.min_points)

  if (rewardMode === "classic_top3") {
    const classicUsers = [...users].slice(0, 3)
    while (classicUsers.length < 3) classicUsers.push(placeholderUser)

    const classicLayout = [
      { place: 2, card: "bg-slate-100", accent: "text-slate-500", border: "border-slate-200" },
      { place: 1, card: "bg-amber-100", accent: "text-amber-600", border: "border-amber-200" },
      { place: 3, card: "bg-orange-100", accent: "text-orange-600", border: "border-orange-200" },
    ]

    return (
      <section className="rounded-[28px] bg-gradient-to-br from-white via-emerald-50 to-emerald-100/30 p-4 sm:p-8 shadow-xl border border-emerald-100">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-100 pb-4">
          <div className="space-y-1">
            <p className="text-[10px] tracking-[0.4em] uppercase text-emerald-500 font-semibold">
              Podio temporada
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Top Activos</h2>
            {scopeLabel && <p className="text-sm text-gray-500">{scopeLabel}</p>}
          </div>
          <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
            <Trophy className="h-5 w-5" />
            <span>Premios para Top 1, Top 2 y Top 3</span>
          </div>
        </div>

        <div className="mt-6 sm:mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end">
          {classicLayout.map(({ place, card, accent, border }, index) => {
            const user = classicUsers[place - 1]
            const reward = classicRewardByPlace[place]
            const isPlaceholder = user.id === "placeholder"

            return (
              <div key={`${user.id}-${place}`} className={index === 1 ? "md:-translate-y-4" : ""}>
                <div className={`rounded-3xl border p-4 shadow-sm ${card} ${border} flex min-h-[230px] flex-col justify-between`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <span className={accent}>{place}º lugar</span>
                      {!isPlaceholder && <span className="text-gray-400">+{user.periodical_exp} XP</span>}
                    </div>
                    {reward ? (
                      <div className="rounded-2xl bg-white/80 p-3 text-center text-xs text-gray-700 shadow">
                        {reward.image_url && (
                          <div className="mb-3 flex items-center justify-center">
                            <img
                              src={reward.image_url}
                              alt={reward.title}
                              className="h-24 w-full rounded-xl object-contain bg-white"
                            />
                          </div>
                        )}
                        <p className="text-sm font-semibold text-gray-900">{reward.title}</p>
                        {reward.description && (
                          <p className="mt-1 text-[11px] text-gray-500 line-clamp-2">{reward.description}</p>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-gray-300 p-3 text-center text-xs text-gray-500">
                        Recompensa pendiente
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    {isPlaceholder ? (
                      <div className="text-xs text-gray-400">Aún sin ganador</div>
                    ) : (
                      <>
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.first_name} className="h-12 w-12 rounded-full object-cover shadow" />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-semibold text-gray-500 shadow">
                            {user.first_name?.charAt(0) || user.last_name?.charAt(0) || "?"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-xs text-gray-500">+{user.periodical_exp} XP</p>
                        </div>
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

  return (
    <section className="rounded-[28px] bg-gradient-to-br from-white via-emerald-50 to-emerald-100/30 p-4 sm:p-8 shadow-xl border border-emerald-100">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-100 pb-4">
        <div className="space-y-1">
          <p className="text-[10px] tracking-[0.4em] uppercase text-emerald-500 font-semibold">
            Podio temporada
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Top Activos</h2>
          {scopeLabel && <p className="text-sm text-gray-500">{scopeLabel}</p>}
        </div>
        <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
          <Trophy className="h-5 w-5" />
          <span>Top 1 garantizado + 2 sorteos por umbrales</span>
        </div>
      </div>

      <div className="mt-6 sm:mt-10">
        <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-100 to-emerald-50 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <span className="text-amber-700">Ganador · #1</span>
            {winner.id !== "placeholder" && <span className="text-gray-400">+{winner.periodical_exp} XP</span>}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
            <div className="flex flex-col items-center text-center">
              {winner.id === "placeholder" ? (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/70 text-sm font-semibold text-gray-500 shadow">
                  ?
                </div>
              ) : winner.avatar_url ? (
                <img
                  src={winner.avatar_url}
                  alt={winner.first_name}
                  className="h-20 w-20 rounded-full object-cover shadow"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/70 text-2xl font-semibold text-gray-500 shadow">
                  {winner.first_name?.charAt(0) || winner.last_name?.charAt(0) || "?"}
                </div>
              )}
              <p className="mt-3 text-lg font-semibold text-gray-900">
                {winner.id === "placeholder" ? "Aún sin ganador" : `${winner.first_name} ${winner.last_name}`}
              </p>
              {winner.id !== "placeholder" && <p className="text-sm text-gray-500">+{winner.periodical_exp} XP</p>}
            </div>

            {guaranteedReward ? (
              <div className="rounded-3xl bg-white/85 p-4 text-center text-sm text-gray-700 shadow">
                {guaranteedReward.image_url && (
                  <div className="mb-4 flex items-center justify-center">
                    <img
                      src={guaranteedReward.image_url}
                      alt={guaranteedReward.title}
                      className="h-36 w-full rounded-2xl object-contain bg-white"
                    />
                  </div>
                )}
                <p className="text-lg font-semibold text-gray-900">{guaranteedReward.title}</p>
                {guaranteedReward.description && (
                  <p className="mt-2 text-sm text-gray-500">{guaranteedReward.description}</p>
                )}
                {guaranteedReward.cta_url && (
                  <a
                    href={guaranteedReward.cta_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600"
                  >
                    Ver más
                  </a>
                )}
              </div>
            ) : (
              <div className="rounded-3xl bg-white/80 p-5 text-left text-sm text-gray-600 shadow">
                <p className="font-semibold text-gray-900">Premio Top 1 pendiente</p>
                <p className="mt-2">
                  Configura el premio garantizado para la persona que termine en primera posición.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-emerald-100 bg-white/80 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-900">
            <Gift className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Premios sorteables
            </h3>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {raffleRewardMeta.map(({ key, label }) => {
              const reward = rewards?.[key]
              return (
                <div key={key} className="rounded-2xl border border-gray-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
                    {label}
                  </p>
                  {reward ? (
                    <div className="mt-3 space-y-3">
                      {reward.image_url && (
                        <img
                          src={reward.image_url}
                          alt={reward.title}
                          className="h-32 w-full rounded-xl bg-gray-50 object-contain"
                        />
                      )}
                      <div>
                        <p className="text-base font-semibold text-gray-900">{reward.title}</p>
                        {reward.description && (
                          <p className="mt-1 text-sm text-gray-500">{reward.description}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                      Premio pendiente de configurar
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white/80 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-gray-900">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Participaciones por puntos
            </h3>
          </div>
          <div className="mt-4 rounded-2xl bg-emerald-50/70 p-4">
            <p className="text-sm text-gray-600">Tus participaciones actuales</p>
            <p className="mt-1 text-3xl font-bold text-emerald-700">
              {Number(userRaffleEntries ?? 0).toLocaleString("es-ES")}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Se aplica siempre el umbral más alto que hayas alcanzado.
            </p>
          </div>

          <div className="mt-4 space-y-2">
            {activeThresholds.length ? (
              activeThresholds.map((threshold) => (
                <div
                  key={threshold.id}
                  className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm"
                >
                  <span className="text-gray-600">Desde {threshold.min_points.toLocaleString("es-ES")} PA</span>
                  <span className="font-semibold text-gray-900">
                    {threshold.entries_count} participac{threshold.entries_count === 1 ? "ión" : "iones"}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                Aún no hay umbrales configurados para este ámbito.
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && <div className="mt-6 text-center text-sm text-gray-500">Cargando clasificaciones...</div>}
    </section>
  )
}
