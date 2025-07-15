'use client'

import { useEffect, useState, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { usePerfilResumenRef } from '@/context/usePerfilResumenRef' // ✅ Usamos el contexto
import { getLevelFromXP, getXPForNextLevel, getTitleFromLevel } from '@/lib/exp'

type PerfilData = {
  name: string
  nivel: number
  puntos: number
  logros: number
  progreso: number // porcentaje al siguiente nivel
  titulo: string
}

export function PerfilResumen() {
  const [perfil, setPerfil] = useState<PerfilData | null>(null)
  const ref = usePerfilResumenRef() // ✅ Este es el ref que usarás

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClientComponentClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('users')
        .select('exp, first_name, last_name')
        .eq('id', user.id)
        .single()

      if (error || !data) return

      const exp = data.exp || 0
      const level = getLevelFromXP(exp)
      const xpForThisLevel = getXPForNextLevel(level - 1)
      const xpForNextLevel = getXPForNextLevel(level)

      const progreso = Math.round(((exp - xpForThisLevel) / (xpForNextLevel - xpForThisLevel)) * 100)
      const titulo = getTitleFromLevel(level)
      const nombre =
      (data.first_name && data.last_name)
        ? `${data.first_name} ${data.last_name}`
        : user.email || 'Usuario'


      const { count: logrosDesbloqueados } = await supabase
        .from('user_achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        
      setPerfil({
        name: nombre,
        nivel: level,
        puntos: exp,
        logros: logrosDesbloqueados || 0,
        progreso,
        titulo
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
      ref={ref} // ✅ Referencia que usará RetoCard para animar los puntos hacia aquí
      className="bg-white rounded-xl shadow-md border border-gray-200 p-6 max-w-xl mx-auto"
    >
      <div className="flex items-center justify-between mb-4">
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
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Logros desbloqueados</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{perfil.logros}</p>
        </div>
      </div>

      <Progress value={perfil.progreso} />
      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
        Progreso hacia el siguiente nivel: {perfil.progreso}%
      </p>
    </div>
  )
}
