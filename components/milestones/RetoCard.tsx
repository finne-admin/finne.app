'use client'

import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import { PuntoVolador } from '@/components/milestones/PuntoVolador'
import { usePerfilResumenRef } from '@/context/usePerfilResumenRef'
import { PuntoVoladorPortal } from '@/components/animations/PuntoVoladorPortal'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { checkAchievements } from '@/lib/achievements'


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

  const handleReclamar = async () => {
    if (!puedeReclamar || !cardRef.current || !perfilRef?.current) return

    const supabase = createClientComponentClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 1. Marcar como reclamado
    const { error: updateError } = await supabase
      .from('user_weekly_challenges')
      .update({
        reclamado: true,
      })
      .eq('user_id', user.id)
      .eq('challenge_id', reto.id)

    if (updateError) {
      console.error('Error al marcar reto como reclamado:', updateError)
      return
    }

    // 2. Sumar experiencia con función SQL
    const { error: expError } = await supabase.rpc('increment_user_exp', {
      user_id_input: user.id,
      amount: reto.puntos
    })

    if (expError) {
      console.error('Error al añadir exp del reto:', expError)
    } else {
      console.log('Experiencia añadida correctamente')
      await checkAchievements(user.id, 'ranking_final')
    }

    // 3. (opcional) registrar acción
    await supabase.from('activity_points').insert({
      user_id: user.id,
      action_type: 'reto',
      points: reto.puntos,
      metadata: { challenge_id: reto.id }
    })

    // 4. Animación de puntos
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

    const nuevosPuntos = Array.from({ length: 10 }, (_, i) => ({
      x: from.x + Math.random() * 30 - 15,
      y: from.y + Math.random() * 20 - 10,
      toX: to.x + Math.random() * 20 - 10,
      toY: to.y + Math.random() * 20 - 10,
    }))

    setPuntosVoladores(nuevosPuntos)

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
        <PuntoVoladorPortal key={index}>
        <PuntoVolador
            from={{ x: punto.x, y: punto.y }}
            to={{ x: punto.toX, y: punto.toY }}
        />
        </PuntoVoladorPortal>
    ))}
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
