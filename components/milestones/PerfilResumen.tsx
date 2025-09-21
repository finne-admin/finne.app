'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image' // ← nuevo
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Progress } from '@/components/ui/progressProfile'
import { Skeleton } from '@/components/ui/skeleton'
import { usePerfilResumenRef } from '@/context/usePerfilResumenRef'
import { getLevelStateFromXP, getXPForNextLevel, getTitleFromLevel } from '@/lib/exp'
import { DateTime } from 'luxon'
import { getActiveStreak } from '@/components/utils/getActiveStreak'


type PerfilData = {
  name: string
  nivel: number
  puntos: number
  logros: number
  progreso: number
  titulo: string
  racha: number
  avatarUrl?: string        // ← nuevo
}

export function PerfilResumen() {
  const [perfil, setPerfil] = useState<PerfilData | null>(null)
  const ref = usePerfilResumenRef()

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClientComponentClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Datos básicos
      const { data, error } = await supabase
        .from('users')
        .select('exp, first_name, last_name, avatar_url') 
        .eq('id', user.id)
        .single()

      if (error || !data) return

      const exp = data.exp || 0
      const { level, progress } = getLevelStateFromXP(exp);
      const titulo = getTitleFromLevel(level)
      const nombre =
        (data.first_name && data.last_name)
          ? `${data.first_name} ${data.last_name}`
          : user.email || 'Usuario'

      // Logros desbloqueados
      const { count: logrosDesbloqueados } = await supabase
        .from('user_achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      // Días con pausas activas en los últimos 30 días
      const desde = DateTime.now().minus({ days: 30 }).toISO()
      const { data: pausas } = await supabase
        .from('active_pauses')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', desde)

      const pausasArray = (pausas?.map(p =>
        DateTime.fromISO(p.created_at, { zone: 'utc' })
          .setZone('Europe/Madrid')
          .toISODate()
      ).filter((d): d is string => typeof d === 'string')) || []

      const racha = getActiveStreak(pausasArray)

      setPerfil({
        name: nombre,
        nivel: level,
        puntos: exp,
        logros: logrosDesbloqueados || 0,
        progreso: progress,
        titulo,
        racha,
        avatarUrl: data.avatar_url || undefined, // ← nuevo
      })
    }

    fetchData()
  }, [])

  if (!perfil) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="bg-white rounded-xl shadow-md border border-gray-200 p-6 max-w-xl mx-auto"
    >
      <div className="flex items-center justify-between mb-4">
        {/* IZQUIERDA: avatar + textos */}
        <div className="flex items-center gap-4">
          <Image
            src={perfil.avatarUrl || '/default-avatar.png'}
            alt="Avatar"
            width={56}
            height={56}
            className="rounded-full border border-gray-200 shrink-0"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/default-avatar.png'
            }}
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Hola, {perfil.name}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Nivel {perfil.nivel} · {perfil.puntos} PA
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {perfil.titulo}
            </p>
          </div>
        </div>

        {/* DERECHA: métricas */}
        <div className="text-right space-y-1">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Logros</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{perfil.logros}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Racha</p>
            <p className="text-lg font-bold text-emerald-600">{perfil.racha} días</p>
          </div>
        </div>
      </div>

      <Progress value={perfil.progreso} />
      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
        Progreso hacia el siguiente nivel: {perfil.progreso}%
      </p>
    </div>
  )
}
