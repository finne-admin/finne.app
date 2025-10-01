'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { DateTime } from 'luxon'

const diasSemana = ['L', 'M', 'X', 'J', 'V']

export function ActividadSemanal() {
  const [actividad, setActividad] = useState<boolean[]>([false, false, false, false, false])

  useEffect(() => {
    const fetchActividad = async () => {
      const supabase = createClientComponentClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const ZONE = 'Europe/Madrid'

      // Hoy en Madrid
      const nowM = DateTime.now().setZone(ZONE).startOf('day')
      // Lunes 00:00 en Madrid
      const mondayM = nowM.minus({ days: ((nowM.weekday + 6) % 7) }).startOf('day') // weekday: 1=Lunes…7=Domingo
      // Próximo lunes 00:00 en Madrid (límite superior exclusivo)
      const nextMondayM = mondayM.plus({ days: 7 })

      // Pasar límites a UTC para la query
      const mondayUTC = mondayM.toUTC().toISO()
      const nextMondayUTC = nextMondayM.toUTC().toISO()

      const { data: pausas, error } = await supabase
        .from('active_pauses')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', mondayUTC)
        .lt('created_at', nextMondayUTC) // exclusivo

      if (error) {
        console.error('Error cargando pausas activas:', error)
        return
      }

      const actividadPorDia = [false, false, false, false, false];

      (pausas ?? []).forEach((p) => {
        // convertir cada timestamp (UTC) a Madrid y quedarnos con el día
        const dM = DateTime.fromISO(p.created_at, { zone: 'utc' }).setZone(ZONE)
        if (dM.weekday >= 1 && dM.weekday <= 5) {
          const index = dM.weekday - 1 // L=1 → 0 … V=5 → 4
          actividadPorDia[index] = true
        }
      })

      setActividad(actividadPorDia)
    }

    fetchActividad()
  }, [])

  const activos = actividad.filter(Boolean).length

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 max-w-xl mx-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad semanal</h3>

      <div className="grid grid-cols-5 gap-3 text-center text-sm font-medium">
        {diasSemana.map((dia, i) => {
          const activo = actividad[i]
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
        {activos} / 5 días activos esta semana
      </p>
    </div>
  )
}
