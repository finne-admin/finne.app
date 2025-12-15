'use client'

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { PuntoVolador } from "@/components/milestones/FloatingPoint"
import { usePerfilResumenRef } from "@/context/useProfileSummaryRef"
import { PuntoVoladorPortal } from "@/components/animations/FloatingPointPortal"
import { apiPost } from "@/lib/apiClient"

export type Reto = {
  id: string
  titulo: string
  descripcion: string
  progresoActual: number
  progresoTotal: number
  puntos: number
  completado: boolean
  reclamado: boolean
}

interface Props {
  reto: Reto
  onClaim?: (retoId: string) => void
}

export function RetoCard({ reto, onClaim }: Props) {
  const [reclamado, setReclamado] = useState(reto.reclamado)
  const [showAnim, setShowAnim] = useState(false)
  const [puntosVoladores, setPuntosVoladores] = useState<
    { x: number; y: number; toX: number; toY: number }[]
  >([])
  const cardRef = useRef<HTMLDivElement>(null)
  const perfilRef = usePerfilResumenRef()

  const progresoPorcentaje = Math.min(
    100,
    Math.round((reto.progresoActual / Math.max(1, reto.progresoTotal)) * 100)
  )

  const puedeReclamar = reto.completado && !reclamado

  useEffect(() => {
    setReclamado(reto.reclamado)
  }, [reto.reclamado])

  const handleReclamar = async () => {
    if (!puedeReclamar || !cardRef.current || !perfilRef?.current) return

    try {
      const res = await apiPost(`/api/milestones/weekly-challenges/${reto.id}/claim`, {})
      const data = await res.json()
      if (!res.ok) {
        console.error("Error al reclamar reto:", data)
        return
      }
    } catch (error) {
      console.error("Error al reclamar reto:", error)
      return
    }

    setReclamado(true)
    setShowAnim(true)

    const fromRect = cardRef.current.getBoundingClientRect()
    const toRect = perfilRef.current.getBoundingClientRect()

    const from = {
      x: fromRect.left + fromRect.width / 2,
      y: fromRect.top + fromRect.height / 2,
    }

    const to = {
      x: toRect.left + toRect.width / 2,
      y: toRect.top + toRect.height / 2,
    }

    const nuevosPuntos = Array.from({ length: 10 }, () => ({
      x: from.x + Math.random() * 30 - 15,
      y: from.y + Math.random() * 20 - 10,
      toX: to.x + Math.random() * 20 - 10,
      toY: to.y + Math.random() * 20 - 10,
    }))

    setPuntosVoladores(nuevosPuntos)
    onClaim?.(reto.id)
    setTimeout(() => {
      setShowAnim(false)
      setPuntosVoladores([])
    }, 1200)
  }

  return (
    <motion.div
      ref={cardRef}
      onClick={handleReclamar}
      initial={false}
      animate={
        reclamado
          ? {
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 0px rgba(0,0,0,0)",
                "0 0 12px rgba(16,185,129,0.7)",
                "0 0 0px rgba(0,0,0,0)",
              ],
            }
          : {}
      }
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className={cn(
        "relative p-3.5 rounded-xl border shadow-sm transition-all cursor-pointer w-full min-h-[120px] max-w-none flex flex-col justify-between",
        puedeReclamar && "bg-yellow-100 border-yellow-400 hover:border-yellow-500 ring-1 ring-yellow-300",
        reclamado && "bg-green-50 border-green-400 text-green-900",
        !reto.completado && "bg-white text-muted-foreground cursor-default"
      )}
    >
      <AnimatePresence>
        {puntosVoladores.map((punto, index) => (
          <PuntoVoladorPortal key={index}>
            <PuntoVolador from={{ x: punto.x, y: punto.y }} to={{ x: punto.toX, y: punto.toY }} />
          </PuntoVoladorPortal>
        ))}
      </AnimatePresence>

      <div>
        <h3 className="text-sm font-semibold mb-1 leading-tight">{reto.titulo}</h3>
        <p className="text-xs text-gray-600 line-clamp-2 leading-snug">{reto.descripcion}</p>
      </div>

      <div className="mt-2">
        <Progress value={progresoPorcentaje} className="h-2.5" />
        <div className="flex justify-between items-center mt-1 text-xs">
          <span>
            {reto.progresoActual} / {reto.progresoTotal}
          </span>
          <span className="font-semibold text-emerald-600">+{reto.puntos} PA</span>
        </div>
        <div className="text-[11px] h-4 mt-1 text-green-700 font-medium">
          {puedeReclamar ? "Haz clic para reclamar" : reclamado ? "Reclamado" : ""}
        </div>
      </div>
    </motion.div>
  )
}
