'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

type PerfilData = {
  name: string
  nivel: number
  puntos: number
  logros: number
  progreso: number // porcentaje al siguiente nivel
}

export function PerfilResumen() {
  const [perfil, setPerfil] = useState<PerfilData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClientComponentClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // ⚠️ Datos simulados de ejemplo (los sustituiremos luego)
      const puntosTotales = 380 // ← más adelante: obtener con SUM(activity_points)
      const logrosDesbloqueados = 3

      // Niveles base según el plan
      const niveles = [
        { nivel: 1, min: 0, max: 199 },
        { nivel: 2, min: 200, max: 499 },
        { nivel: 3, min: 500, max: 999 },
        { nivel: 4, min: 1000, max: 1499 },
        { nivel: 5, min: 1500, max: Infinity }
      ]

      const nivelActual = niveles.find(n => puntosTotales >= n.min && puntosTotales <= n.max) || niveles[0]
      const progreso = Math.min(100, Math.round(((puntosTotales - nivelActual.min) / (nivelActual.max - nivelActual.min)) * 100))

      setPerfil({
        name: user.user_metadata?.name || user.email || 'Usuario',
        nivel: nivelActual.nivel,
        puntos: puntosTotales,
        logros: logrosDesbloqueados,
        progreso
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
    <div className="bg-white rounded-xl shadow p-6 border max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Hola, {perfil.name}</h2>
          <p className="text-muted-foreground">Nivel {perfil.nivel} · {perfil.puntos} PA</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Logros desbloqueados</p>
          <p className="text-lg font-bold">{perfil.logros}</p>
        </div>
      </div>

      <Progress value={perfil.progreso} />
      <p className="text-sm text-muted-foreground mt-2">
        Progreso hacia el siguiente nivel: {perfil.progreso}%
      </p>
    </div>
  )
}
