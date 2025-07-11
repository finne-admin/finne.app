'use client'

import { useEffect, useState } from 'react'

const diasSemana = ['L', 'M', 'X', 'J', 'V'] // Fin de semana eliminado

export function ActividadSemanal() {
  const [actividad, setActividad] = useState<boolean[]>([])

  useEffect(() => {
    // 🔧 Simulación: días activos esta semana (L-V)
    // true = se hizo al menos 1 pausa ese día
    setActividad([true, true, false, true, false]) // Solo 5 días
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
