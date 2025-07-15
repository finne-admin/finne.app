'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { RetoCard, Reto } from './RetoCard'

export function RetosSemanales() {
  const [retos, setRetos] = useState<Reto[]>([])

  useEffect(() => {
    const fetchRetos = async () => {
      const supabase = createClientComponentClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 1. Obtener catálogo de retos
      const { data: catalogo } = await supabase
        .from('weekly_challenges_catalog')
        .select('*')

      // 2. Obtener progreso del usuario
      const { data: progreso } = await supabase
        .from('user_weekly_challenges')
        .select('challenge_id,progreso_actual,progreso_total,completado,reclamado')
        .eq('user_id', user.id)

      const mapa = new Map(progreso?.map(p => [p.challenge_id, p]))

      // 3. Combinar datos
      const retosConProgreso: Reto[] = catalogo?.map(item => {
        const prog = mapa.get(item.id)

        return {
          id: item.id,
          titulo: item.title,
          descripcion: item.description,
          puntos: item.points,
          progresoActual: prog?.progreso_actual || 0,
          progresoTotal: prog?.progreso_total || 1,
          completado: prog?.completado || false,
          reclamado: prog?.reclamado || false
        }
      }) || []

      setRetos(retosConProgreso)
    }

    fetchRetos()
  }, [])

  return (
    <section className="pb-4 max-w-6xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-3 px-1">Retos semanales</h2>
      <div className="overflow-x-auto group">
        <div className="flex gap-4 px-1 min-w-full w-max pb-2 group-hover:scrollbar-thumb-gray-400 scrollbar-thumb-transparent scrollbar-track-transparent scrollbar-thin">
          {retos.map((reto) => (
            <div key={reto.id} className="min-w-[250px]">
              <RetoCard reto={reto} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
