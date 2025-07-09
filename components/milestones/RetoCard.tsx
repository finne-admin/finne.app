'use client'

import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import { PuntoVolador } from '@/components/milestones/PuntoVolador'
import { usePerfilResumenRef } from '@/context/usePerfilResumenRef'


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

export function RetoCard({ reto }: { reto: Reto }) {
  const [reclamado, setReclamado] = useState(reto.reclamado)
  const [showAnim, setShowAnim] = useState(false)
  const [puntosVoladores, setPuntosVoladores] = useState<{ x: number; y: number; toX: number; toY: number }[]>([])
  const cardRef = useRef<HTMLDivElement>(null)
  const perfilRef = usePerfilResumenRef()

  const progresoPorcentaje = Math.min(
    100,
    Math.round((reto.progresoActual / reto.progresoTotal) * 100)
  )

  const puedeReclamar = reto.completado && !reclamado

  const handleReclamar = () => {
    if (!puedeReclamar || !cardRef.current || !perfilRef?.current) return

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

    // Crear 7 puntos flotantes con leves variaciones
    const nuevosPuntos = Array.from({ length: 7 }, (_, i) => ({
      x: from.x + Math.random() * 30 - 15,
      y: from.y + Math.random() * 20 - 10,
      toX: to.x + Math.random() * 20 - 10,
      toY: to.y + Math.random() * 20 - 10,
    }))

    setPuntosVoladores(nuevosPuntos)

    // Limpiar animación después de 1.2s
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
                '0 0 0px rgba(0,0,0,0)',
                '0 0 12px rgba(16,185,129,0.7)',
                '0 0 0px rgba(0,0,0,0)',
              ],
            }
          : {}
      }
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className={cn(
        'relative p-4 rounded-xl border shadow-sm transition-all cursor-pointer max-w-xs w-full h-[160px] flex flex-col justify-between',
        puedeReclamar && 'bg-green-50 border-green-400',
        reclamado && 'bg-white border-gray-200',
        !reto.completado && 'bg-muted/20 text-muted-foreground cursor-default'
      )}
    >
      {/* PUNTOS ANIMADOS */}
      <AnimatePresence>
        {puntosVoladores.map((punto, index) => (
          <PuntoVolador
            key={index}
            from={{ x: punto.x, y: punto.y }}
            to={{ x: punto.toX, y: punto.toY }}
          />
        ))}
      </AnimatePresence>

      {/* Texto flotante +XP */}
      <AnimatePresence>
        {showAnim && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -40 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute top-4 right-4 text-emerald-500 font-bold text-sm pointer-events-none"
          >
            +{reto.puntos} PA
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h3 className="text-sm font-semibold mb-1 leading-tight">{reto.titulo}</h3>
        <p className="text-xs text-gray-600">{reto.descripcion}</p>
      </div>

      <div className="mt-2">
        <Progress value={progresoPorcentaje} className="h-2" />
        <div className="flex justify-between items-center mt-1 text-xs">
          <span>
            {reto.progresoActual} / {reto.progresoTotal}
          </span>
          <span className="font-semibold text-emerald-600">+{reto.puntos} PA</span>
        </div>
        <div className="text-[11px] h-4 mt-1 text-green-700 font-medium">
          {reclamado ? 'Recompensa reclamada' : ''}
        </div>
      </div>
    </motion.div>
  )
}
