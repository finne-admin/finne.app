'use client'

import { Trophy } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { PodiumReward } from "./RewardsPodium"

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
  rewards?: Record<number, PodiumReward | undefined>
}

export function RankingUsuarios({
  usuarios,
  userPosition,
  totalUsuarios,
  loading = false,
  rewards,
}: RankingUsuariosProps) {
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-12 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div id="ranking-card" className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-bold mb-4">Ranking de temporada</h2>
      <div className="divide-y">
        {usuarios.map((usuario, index) => {
          const isTop3 = index < 3
          const Wrapper: any = isTop3 ? motion.div : "div"
          const rewardInfo = rewards?.[index + 1]

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
                "flex justify-between items-center py-3 px-2 transition-all",
                index === 0 && "bg-yellow-50 ring-2 ring-yellow-400 shadow-md",
                index === 1 && "bg-gray-100",
                index === 2 && "bg-orange-50"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold w-5 text-right">{index + 1}</span>
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

                <span className="text-sm text-gray-800">
                  {usuario.first_name} {usuario.last_name}
                </span>
              </div>

              <div className="text-sm font-medium text-emerald-600">{usuario.periodical_exp} PA</div>
              {rewardInfo && (
                <div className="ml-4 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  {rewardInfo.title}
                </div>
              )}
            </Wrapper>
          )
        })}
      </div>

      {userPosition && totalUsuarios && (
        <motion.div
          className="mt-6 text-sm text-gray-600 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Estás en el puesto <strong>{userPosition}</strong> de {totalUsuarios}
        </motion.div>
      )}
    </div>
  )
}
