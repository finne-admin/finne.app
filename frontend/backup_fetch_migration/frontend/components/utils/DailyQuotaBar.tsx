'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type QuotaState = {
  usedToday: number
  remainingToday: number
  loadingQuota: boolean
  quotaError: string | null
  refetchQuota: () => Promise<void>
}

/** Hook para gestionar cupo diario de una tabla con created_at y user_id */
export function useDailyQuota(limit = 3, table = 'active_pauses'): QuotaState {
  const supabase = useMemo(() => createClientComponentClient(), [])
  const [usedToday, setUsedToday] = useState(0)
  const [remainingToday, setRemainingToday] = useState(limit)
  const [loadingQuota, setLoadingQuota] = useState(true)
  const [quotaError, setQuotaError] = useState<string | null>(null)

  const getTodayBoundsISO = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const end = new Date(start); end.setDate(end.getDate() + 1)
    return { startISO: start.toISOString(), endISO: end.toISOString() }
  }

  const fetchDailyQuota = useCallback(async () => {
    setLoadingQuota(true)
    setQuotaError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.id) throw new Error('No hay usuario autenticado')
      const { startISO, endISO } = getTodayBoundsISO()
      const { count, error } = await supabase
        .from(table)
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startISO)
        .lt('created_at', endISO)
      if (error) throw error
      const used = count ?? 0
      setUsedToday(used)
      setRemainingToday(Math.max(0, limit - used))
    } catch (e: any) {
      setQuotaError(e.message || 'Error al consultar el cupo')
    } finally {
      setLoadingQuota(false)
    }
  }, [supabase, table, limit])

  useEffect(() => { void fetchDailyQuota() }, [fetchDailyQuota])

  return { usedToday, remainingToday, loadingQuota, quotaError, refetchQuota: fetchDailyQuota }
}

/* =========================
   Token circular estilo +X AP
   ========================= */
function QuotaToken({
  filled,
  points,
  unit,
}: {
  filled: boolean
  points: number
  unit: string
}) {
  return (
    <div
      className={[
        'h-10 w-16 sm:h-12 sm:w-20 rounded-md border',
        'flex flex-col items-center justify-center text-center leading-tight select-none',
        filled
          ? 'bg-emerald-400 text-white border-emerald-500'
          : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-200 dark:border-indigo-800',
        'mx-0.01' // Reduce el margen horizontal entre rectángulos
      ].join(' ')}
      aria-label={filled ? `Pausa bonificada usada (+${points} ${unit})` : `Pausa bonificada disponible (+${points} ${unit})`}
      title={filled ? 'Ya has obtenido estos puntos' : 'Obtendrás puntos al usar esta pausa'}
    >
      <div className="font-semibold text-[11px] sm:text-[12px]">
        +{points}
        <div className="text-[10px] opacity-80 -mt-0.5">{unit}</div>
      </div>
    </div>
  )
}

/** Barra con N círculos tipo “+X AP” */
export function DailyQuotaBar({
  limit = 3,
  usedToday,
  loading,
  error,
  pointsPerPause = 20,
  unitLabel = 'AP',
  className,
}: {
  limit?: number
  usedToday: number
  loading?: boolean
  error?: string | null
  pointsPerPause?: number
  unitLabel?: string
  className?: string
}) {
  const remaining = Math.max(0, limit - usedToday)
  const segments = Array.from({ length: limit }, (_, i) => i < usedToday) // true = consumido

  return (
    <div className={['mt-4 flex flex-col items-center gap-3', className || ''].join(' ')}>
      <div className="flex items-center gap-2 text-sm">
        {loading ? (
          <span className="text-gray-500">Cargando cupo diario…</span>
        ) : error ? (
          <span className="text-red-600">No se pudo cargar el cupo</span>
        ) : remaining > 0 ? (
          <span className="text-gray-700">
            Te quedan <strong>{remaining}</strong> pausa{remaining === 1 ? '' : 's'} con recompensa hoy
          </span>
        ) : (
          <span className="text-gray-700">Has alcanzado el límite diario con recompensa</span>
        )}
      </div>

      <div className="flex gap-3">
        {segments.map((isFilled, idx) => (
          <QuotaToken
            key={idx}
            filled={isFilled}
            points={pointsPerPause}
            unit={unitLabel}
          />
        ))}
      </div>

      <div className="text-[11px] text-gray-500">
        Puedes hacer más pausas, pero sólo las primeras {limit} dan experiencia.
      </div>
    </div>
  )
}
