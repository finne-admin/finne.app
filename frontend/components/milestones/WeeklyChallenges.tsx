// components/milestones/RetosSemanales.tsx
'use client'

import { useEffect, useState } from 'react'
import { RetoCard, Reto } from './WeeklyAchievementCard'
import { apiGet } from '@/lib/apiClient'

export function RetosSemanales() {
  const [retos, setRetos] = useState<Reto[]>([])

  useEffect(() => {
    const fetchRetos = async () => {
      try {
        const res = await apiGet("/api/milestones/weekly-challenges")
        const data = await res.json()
        if (!res.ok) {
          console.error("Error al obtener retos semanales:", data)
          return
        }
        setRetos(Array.isArray(data.challenges) ? data.challenges : [])
      } catch (error) {
        console.error("Error al cargar retos semanales:", error)
      }
    }

    fetchRetos()
  }, [])

  const handleRetoReclamado = (retoId: string) => {
    setRetos((prev) =>
      prev.map((reto) =>
        reto.id === retoId
          ? {
              ...reto,
              reclamado: true,
            }
          : reto
      )
    )
  }

  return (
    <section className="w-full pb-2 max-h-[520px] overflow-y-auto pr-1">
      <div className="flex flex-col gap-3">
        {retos.map((reto) => (
          <div key={reto.id} className="w-full">
            <RetoCard reto={reto} onClaim={handleRetoReclamado} />
          </div>
        ))}
      </div>
    </section>
  )
}
