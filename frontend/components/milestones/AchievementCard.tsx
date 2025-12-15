'use client'

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export type Logro = {
  id: string
  titulo: string
  descripcion: string
  icono: string
  category?: string | null
  completado: boolean
  reclamado: boolean
  puntos: number
  groupId?: string | null
  level?: number | null
  progresoActual?: number
  progresoTotal?: number
}

interface Props {
  logro: Logro
  // Si se pasan, representan los niveles del mismo logro agrupado
  levels?: Logro[]
}

export function AchievementCard({ logro, levels }: Props) {
  const orderedLevels = levels
    ? [...levels].sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
    : [logro]

  const [currentIndex, setCurrentIndex] = useState(() => {
    const pending = orderedLevels.findIndex((lvl) => !lvl.completado)
    return pending === -1 ? orderedLevels.length - 1 : pending
  })

  const current = orderedLevels[currentIndex] ?? logro

  useEffect(() => {
    if (!levels) return
    const pending = orderedLevels.findIndex((lvl) => !lvl.completado)
    setCurrentIndex(pending === -1 ? orderedLevels.length - 1 : pending)
  }, [levels, orderedLevels.length])

  const esPendiente = !current.completado
  const esProcesando = current.completado && !current.reclamado
  const esReclamado = current.reclamado
  const totalLevels = orderedLevels.length
  const showProgress =
    typeof current.progresoActual === "number" && typeof current.progresoTotal === "number"
  const progressDisplay = showProgress
    ? `${Math.min(current.progresoActual ?? 0, current.progresoTotal ?? 0)} / ${
        current.progresoTotal ?? 0
      }`
    : null

  const statusChip = esReclamado
    ? { label: "Completado", className: "bg-emerald-200 text-emerald-900" }
    : esProcesando
    ? { label: "Desbloqueado", className: "bg-yellow-200 text-yellow-900" }
    : { label: "En progreso", className: "bg-slate-200 text-slate-900" }

  return (
    <motion.div
      initial={false}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "group relative overflow-hidden flex items-center gap-4 p-4 rounded-xl border shadow-sm transition-all cursor-default w-full select-none",
        esPendiente && "bg-muted text-muted-foreground",
        esProcesando && "bg-yellow-50 border-yellow-300 text-yellow-900",
        esReclamado && "bg-emerald-50 border-emerald-400 text-emerald-900",
        !esPendiente && !esProcesando && !esReclamado && "bg-card"
      )}
    >
      {/* Flechas laterales en hover (solo si hay niveles) */}
      {totalLevels > 1 && (
        <>
          <button
            type="button"
            className="absolute inset-y-[-6px] left-0 w-14 flex items-center justify-start bg-gradient-to-r from-emerald-400/30 via-emerald-400/15 to-transparent text-emerald-600 opacity-0 group-hover:opacity-100 transition-all"
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIndex((prev) => (prev - 1 + totalLevels) % totalLevels)
            }}
            aria-label="Nivel anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className="absolute inset-y-[-6px] right-0 w-14 flex items-center justify-end bg-gradient-to-l from-emerald-400/30 via-emerald-400/15 to-transparent text-emerald-600 opacity-0 group-hover:opacity-100 transition-all"
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIndex((prev) => (prev + 1) % totalLevels)
            }}
            aria-label="Siguiente nivel"
          >
            ›
          </button>
        </>
      )}

      <div className="text-3xl">{current.icono}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold truncate">{current.titulo}</h3>
          {totalLevels > 1 && (
            <div className="ml-1 text-xs text-muted-foreground whitespace-nowrap">
              Nivel {current.level ?? currentIndex + 1}/{totalLevels}
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground">{current.descripcion}</p>
        {showProgress && (
          <p className="mt-1 text-xs text-muted-foreground">Progreso: {progressDisplay}</p>
        )}

        {totalLevels > 1 && (
          <div className="mt-3 flex gap-2">
            {orderedLevels.map((lvl, idx) => (
              <div
                key={lvl.id}
                className={cn(
                  "h-2 flex-1 rounded-sm border transition-colors",
                  (lvl.completado || lvl.reclamado) && "bg-emerald-200 border-emerald-300",
                  !lvl.completado && !lvl.reclamado && idx === currentIndex && "border-primary",
                  !lvl.completado && !lvl.reclamado && idx !== currentIndex && "border-muted"
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-2 min-w-[90px]">
        <span
          className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap",
            statusChip.className
          )}
        >
          {statusChip.label}
        </span>
        {current.puntos ? (
          <div className="text-sm font-semibold text-emerald-700">+{current.puntos} XP</div>
        ) : null}
      </div>
    </motion.div>
  )
}
