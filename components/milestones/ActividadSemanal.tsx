'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { startOfWeek, addDays, format, endOfWeek, isSameDay } from 'date-fns'

const diasSemana = ['L', 'M', 'X', 'J', 'V']

export function ActividadSemanal() {
  const [actividad, setActividad] = useState<boolean[]>([false, false, false, false, false])

  useEffect(() => {
    const fetchActividad = async () => {
      const supabase = createClientComponentClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const hoy = new Date()
      const lunes = startOfWeek(hoy, { weekStartsOn: 1 }) // lunes
      const viernes = addDays(lunes, 4)

      const { data: pausas, error } = await supabase
        .from('active_pauses')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', lunes.toISOString())
        .lte('created_at', endOfWeek(viernes, { weekStartsOn: 1 }).toISOString())

      if (error) {
        console.error('Error cargando pausas activas:', error)
        return
      }

      const actividadPorDia = [false, false, false, false, false] // L-V

      pausas?.forEach((pausa) => {
        const fecha = new Date(pausa.created_at)
        for (let i = 0; i < 5; i++) {
          const dia = addDays(lunes, i)
          if (isSameDay(dia, fecha)) {
            actividadPorDia[i] = true
          }
        }
      })

      setActividad(actividadPorDia)
    }

    fetchActividad()
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 max-w-xl mx-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad semanal</h3>

      <div className="grid grid-cols-5 gap-3 text-center text-sm font-medium">
        {diasSemana.map((dia, index) => {
          const activo = actividad[index]
          return (
            <div
              key={dia}
              className={`w-10 h-10 flex items-center justify-center rounded-full 
                ${activo ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}
              title={activo ? 'Activo' : 'Inactivo'}
            >
              {dia}
            </div>
          )
        })}
      </div>

      <p className="text-sm text-gray-600 mt-4 text-center">
        {actividad.filter(Boolean).length} / 5 días activos esta semana
      </p>
    </div>
  )
}
