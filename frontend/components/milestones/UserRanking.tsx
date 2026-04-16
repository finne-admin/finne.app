'use client'

import * as React from "react"
import { Trophy, Search } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { RewardMode, RewardsMap } from "./RewardsPodium"

export type RankingUser = {
  id: string
  first_name: string
  last_name: string
  avatar_url: string | null
  periodical_exp: number
}

type RankingUsuariosProps = {
  usuarios: RankingUser[]
  userPosition: number | null
  totalUsuarios: number | null
  loading?: boolean
  rewards?: RewardsMap
  rewardMode?: RewardMode
  searchQuery?: string
  onSearchChange?: (query: string) => void
  searchResults?: { name: string; score: number; rank?: number }[]
  searching?: boolean
  pageOffset?: number
}

export function RankingUsuarios({
  usuarios,
  userPosition,
  totalUsuarios,
  loading = false,
  rewards,
  rewardMode = "raffle_thresholds",
  searchQuery = "",
  onSearchChange,
  searchResults = [],
  searching = false,
  pageOffset = 0,
}: RankingUsuariosProps) {
  if (loading) {
    return (
      <div className="py-2">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-12 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div id="ranking-card" className="overflow-hidden">
      <div className="divide-y divide-gray-200/80 border-y border-gray-200/80">
        {usuarios.map((usuario, index) => {
          const rankNumber = index + 1 + pageOffset
          const isTop3 = rankNumber <= 3
          const Wrapper: any = isTop3 ? motion.div : "div"
          const rewardInfo =
            rewardMode === "classic_top3"
              ? rankNumber === 1
                ? rewards?.guaranteed_winner
                : rankNumber === 2
                  ? rewards?.raffle_a
                  : rankNumber === 3
                    ? rewards?.raffle_b
                    : undefined
              : rankNumber === 1
                ? rewards?.guaranteed_winner
                : undefined

          const props = isTop3
            ? {
                initial: { opacity: 0, y: -10, scale: index === 0 ? 1.2 : 1 },
                animate:
                  index === 0
                    ? {
                        opacity: 1,
                        y: 0,
                        scale: [1, 1.03, 1],
                        boxShadow: [
                          "0 0 0px rgba(255, 215, 0, 0)",
                          "0 0 10px rgba(255, 215, 0, 0.4)",
                          "0 0 0px rgba(255, 215, 0, 0)",
                        ],
                      }
                    : { opacity: 1, y: 0, scale: 1 },
                transition: {
                  duration: index === 0 ? 2 : 0.6,
                  delay: index * 0.3,
                  repeat: 0,
                  type: index === 0 ? "tween" : "spring",
                  stiffness: index === 0 ? undefined : 500,
                  damping: index === 0 ? undefined : 10,
                },
              }
            : {}

          return (
            <Wrapper
              key={usuario.id}
              {...props}
              className={cn(
                "flex items-center gap-3 py-3 px-2 transition-all",
                rankNumber === 1 && "bg-yellow-50/70",
                rankNumber === 2 && "bg-slate-50",
                rankNumber === 3 && "bg-orange-50/70"
              )}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="text-sm font-semibold w-6 shrink-0 text-right">{rankNumber}</span>
                {isTop3 && <Trophy className="h-4 w-4 text-yellow-500" />}

                {usuario.avatar_url ? (
                  <img
                    src={usuario.avatar_url}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                    ?
                  </div>
                )}

                <span className="truncate text-sm text-gray-800">
                  {usuario.first_name} {usuario.last_name}
                </span>
              </div>

              <div className="shrink-0 text-sm font-medium text-emerald-600">{usuario.periodical_exp} PA</div>
              {rewardInfo && (
                <div className="ml-2 hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 sm:block">
                  {rewardInfo.title}
                </div>
              )}
            </Wrapper>
          )
        })}
      </div>

      {userPosition && totalUsuarios && (
        <motion.div
          className="mt-6 space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-sm text-gray-600 text-center">
            Estás en el puesto <strong>{userPosition}</strong> de {totalUsuarios}
          </div>
          <RankingSearch
            value={searchQuery}
            onChange={onSearchChange}
            searching={searching}
            results={searchResults}
          />
        </motion.div>
      )}
    </div>
  )
}

function RankingSearch({
  value,
  onChange,
  searching,
  results,
}: {
  value: string
  onChange?: (query: string) => void
  searching: boolean
  results: { name: string; score: number; rank?: number }[]
}) {
  const showResults = value.trim().length > 0

  return (
    <div className="flex w-full flex-col items-center gap-1">
      <div className="flex w-full items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm min-w-0 sm:min-w-[240px]">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          className="w-full min-w-0 bg-transparent outline-none"
          placeholder="Buscar en el top..."
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
        />
      </div>
      {showResults && (
        <div className="w-full max-w-full sm:max-w-[320px] rounded-xl border border-gray-200 bg-white p-2 text-xs text-gray-600">
          {searching ? (
            <div className="py-2 text-center text-gray-500">Buscando...</div>
          ) : results.length ? (
            <div className="space-y-1">
              {results.map((item) => (
                <div
                  key={`${item.name}-${item.score}-${item.rank ?? "x"}`}
                  className="flex items-center justify-between rounded-lg px-2 py-1 hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-700">{item.name}</span>
                  <span className="text-emerald-600 font-semibold">
                    {item.score} PA{item.rank ? ` · #${item.rank}` : ""}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-2 text-center text-gray-500">Sin resultados</div>
          )}
        </div>
      )}
    </div>
  )
}
