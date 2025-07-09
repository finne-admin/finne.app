'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'

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

  const progresoPorcentaje = Math.min(
    100,
    Math.round((reto.progresoActual / reto.progresoTotal) * 100)
  )

  const puedeReclamar = reto.completado && !reclamado

  const handleReclamar = () => {
    if (!puedeReclamar) return
    setReclamado(true)
    setShowAnim(true)

    // Ocultar animación tras 1.2s
    setTimeout(() => {
      setShowAnim(false)
    }, 1200)
  }

  return (
    <motion.div
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
      {/* ANIMACIÓN DE PUNTOS */}
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
