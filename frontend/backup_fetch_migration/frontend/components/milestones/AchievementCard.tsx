'use client'

import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { checkAchievements } from '@/lib/achievements'

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
  const supabase = createClientComponentClient()

  // Lee el estado real por si viene desfasado
  const fetchReclamado = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase
      .from('user_achievements')
      .select('reclamado')
      .eq('user_id', user.id)
      .eq('achievement_id', logro.id)
      .maybeSingle()

    if (!error && data) setReclamado(!!data.reclamado)
  }

  useEffect(() => {
    fetchReclamado()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = async () => {
    if (!logro.completado || reclamado || animando) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // UI optimista: feedback instantáneo
    setReclamado(true)
    setAnimando(true)

    try {
      // 1 solo roundtrip (transacción en la RPC)
      const { error } = await supabase.rpc('claim_achievement', {
        _user: user.id,
        _ach: logro.id,
        _points: logro.puntos,
      })

      if (error) {
        // rollback mínimo en caso de fallo
        console.error('claim_achievement error:', error)
        setReclamado(false)
      } else {
        // Revisa logros derivados sin bloquear la UI
        checkAchievements(user.id, 'ranking_final').catch(console.error)
        // (opcional) re-sync silencioso para asegurar consistencia
        fetchReclamado().catch(() => {})
      }
    } catch (e) {
      console.error(e)
      setReclamado(false)
    } finally {
      // La animación dura ~0.9s independientemente de la red
      setTimeout(() => setAnimando(false), 900)
    }
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
      whileTap={{ scale: 0.98 }}
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl border shadow-sm transition-all cursor-pointer max-w-md w-full select-none',
        esBloqueado && 'bg-muted text-muted-foreground cursor-default',
        esCompletado &&
          'bg-yellow-100 border-yellow-400 hover:border-yellow-500 ring-1 ring-yellow-300',
        esReclamado && 'bg-green-50 border-green-400 text-green-900',
        animando && 'pointer-events-none' // evita doble click durante animación
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
