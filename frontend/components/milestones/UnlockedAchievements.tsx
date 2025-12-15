'use client'

import { useEffect, useState } from "react"
import { apiGet } from "@/lib/apiClient"

type Logro = {
  id: string
  titulo: string
  descripcion: string
  icono: string
}

export function LogrosDesbloqueados() {
  const [logros, setLogros] = useState<Logro[]>([])

  useEffect(() => {
    const fetchLogros = async () => {
      try {
        const res = await apiGet("/api/milestones/achievements/unlocked")
        const data = await res.json()
        if (!res.ok) {
          console.error("Error al cargar logros desbloqueados:", data)
          return
        }
        setLogros(Array.isArray(data.achievements) ? data.achievements : [])
      } catch (error) {
        console.error("Error al obtener logros desbloqueados:", error)
      }
    }

    fetchLogros()
  }, [])

  return (
    <section className="max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Logros desbloqueados</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {logros.map((logro) => (
          <div
            key={logro.id}
            className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow transition"
          >
            <div className="text-3xl bg-white rounded-lg w-12 h-12 flex items-center justify-center shadow-inner">
              {logro.icono}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800">{logro.titulo}</h4>
              <p className="text-xs text-gray-500">{logro.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
