'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'


export type Logro = {
  id: string
  titulo: string
  descripcion: string
  icono: string // Emoji o URL
  completado: boolean
  reclamado: boolean
  puntos: number
}

export function AchievementCard({ logro }: { logro: Logro }) {
  const [reclamado, setReclamado] = useState(logro.reclamado)
  const [animando, setAnimando] = useState(false)

  const handleClick = async () => {
    if (!logro.completado || reclamado) return

    const supabase = createClientComponentClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setAnimando(true)

    // 1. Marca como reclamado
    const { error: updateError } = await supabase
      .from('user_achievements')
      .update({
        reclamado: true,
      })
      .eq('user_id', user.id)
      .eq('achievement_id', logro.id)

    if (updateError) {
      console.error('Error al marcar logro como reclamado:', updateError)
      setAnimando(false)
      return
    }

    // 2. Suma puntos al usuario usando la función SQL
    const { data: nuevaExp, error: expError } = await supabase.rpc('increment_user_exp', {
      user_id_input: user.id,
      amount: logro.puntos
    })

    if (expError) {
      console.error('Error al añadir exp:', expError)
    }

    // 3. (opcional) Añadir a activity_points
    await supabase.from('activity_points').insert({
      user_id: user.id,
      action_type: 'logro',
      points: logro.puntos,
      metadata: { achievement_id: logro.id }
    })

    // 4. UI
    setTimeout(() => {
      setReclamado(true)
      setAnimando(false)
    }, 1000)
  }


  const esBloqueado = !logro.completado && !reclamado
  const esCompletado = logro.completado && !reclamado
  const esReclamado = reclamado

  return (
    <motion.div
      onClick={handleClick}
      initial={false}
      animate={
        animando
          ? { scale: [1, 1.1, 0.95, 1.05, 1], boxShadow: '0 0 16px gold' }
          : { scale: 1, boxShadow: 'none' }
      }
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl border shadow-sm transition-all cursor-pointer max-w-md w-full',
        esBloqueado && 'bg-muted text-muted-foreground cursor-default',
        esCompletado &&
          'bg-yellow-100 border-yellow-400 hover:border-yellow-500 ring-1 ring-yellow-300',
        esReclamado && 'bg-green-50 border-green-400 text-green-900'
      )}
    >
      <div className="text-3xl">{logro.icono}</div>
      <div className="flex-1">
        <h3 className="font-semibold">
          {logro.titulo}{' '}
          {esCompletado && !animando && (
            <span className="text-xs text-yellow-800 bg-yellow-200 px-2 py-0.5 rounded ml-2">
              ¡Completado!
            </span>
          )}
          {esReclamado && !animando && (
            <span className="text-xs text-green-800 bg-green-200 px-2 py-0.5 rounded ml-2">
              Reclamado
            </span>
          )}
        </h3>
        <p className="text-sm text-muted-foreground">{logro.descripcion}</p>
      </div>
      {esReclamado && (
        <div className="text-sm text-green-600 font-semibold">+{logro.puntos} PA</div>
      )}
    </motion.div>
  )
}
