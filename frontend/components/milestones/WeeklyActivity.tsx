'use client'

import { useEffect, useState } from "react"
import { apiGet } from "@/lib/apiClient"

const diasSemana = ["L", "M", "X", "J", "V"]

export function ActividadSemanal() {
  const [actividad, setActividad] = useState<boolean[]>([false, false, false, false, false])
  const [activos, setActivos] = useState(0)

  useEffect(() => {
    const fetchActividad = async () => {
      try {
        const res = await apiGet("/api/milestones/weekly-activity")
        const data = await res.json()
        if (!res.ok) {
          console.error("Error al obtener actividad semanal:", data)
          return
        }

        const days =
          Array.isArray(data.days) && data.days.length === 5
            ? data.days
            : [false, false, false, false, false]

        setActividad(days)
        setActivos(Number(data.activeDays ?? days.filter(Boolean).length))
      } catch (error) {
        console.error("Error al cargar actividad semanal:", error)
      }
    }

    fetchActividad()
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 w-full max-w-5xl mx-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad semanal</h3>

      <div className="grid grid-cols-5 gap-3 text-center text-sm font-medium">
        {diasSemana.map((dia, i) => {
          const activo = actividad[i]
          return (
            <div
              key={dia}
              className={`w-10 h-10 flex items-center justify-center rounded-full 
                ${activo ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"}`}
              title={activo ? "Activo" : "Inactivo"}
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

