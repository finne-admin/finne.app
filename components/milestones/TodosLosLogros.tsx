'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { AchievementCard, Logro } from '@/components/milestones/AchievementCard'

export function TodosLosLogros() {
  const [logros, setLogros] = useState<Logro[]>([])

  useEffect(() => {
    const fetchLogros = async () => {
      const supabase = createClientComponentClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Traer todos los logros del catálogo
      const { data: catalogo } = await supabase.from('achievements').select('*')

      // Traer progreso del usuario
      const { data: progreso } = await supabase
        .from('user_achievements')
        .select('achievement_id, completado, reclamado')
        .eq('user_id', user.id)

      const mapa = new Map(progreso?.map(p => [p.achievement_id, p]))

      const logrosConProgreso: Logro[] = catalogo?.map(item => ({
        id: item.id,
        titulo: item.titulo,
        descripcion: item.descripcion,
        icono: item.icono,
        puntos: item.puntos,
        completado: mapa.get(item.id)?.completado || false,
        reclamado: mapa.get(item.id)?.reclamado || false
      })) || []

      setLogros(logrosConProgreso)
    }

    fetchLogros()
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
      {logros.map((logro) => (
        <AchievementCard key={logro.id} logro={logro} />
      ))}
    </div>
  )
}
