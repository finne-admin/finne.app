'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

export type Reto = {
  id: string
  titulo: string
  descripcion: string
  progresoActual: number
  progresoTotal: number
  puntos: number
  completado: boolean
  reclamado: boolean
}

export function RetoCard({ reto }: { reto: Reto }) {
  const [reclamado, setReclamado] = useState(reto.reclamado)

  const progresoPorcentaje = Math.min(
    100,
    Math.round((reto.progresoActual / reto.progresoTotal) * 100)
  )

  const puedeReclamar = reto.completado && !reclamado

  const handleReclamar = () => {
    if (!puedeReclamar) return
    setReclamado(true)
    // Aquí podrías sumar puntos, animar, mostrar toast, etc.
  }

  return (
    <div
      onClick={handleReclamar}
      className={cn(
        'p-4 rounded-xl border shadow-sm transition-all cursor-pointer max-w-xl w-full',
        puedeReclamar && 'bg-green-50 border-green-400',
        reclamado && 'bg-white border-gray-200',
        !reto.completado && 'bg-muted/20 text-muted-foreground cursor-default'
      )}
    >
      <h3 className="text-base font-semibold mb-1">{reto.titulo}</h3>
      <p className="text-sm mb-2">{reto.descripcion}</p>

      <Progress value={progresoPorcentaje} />
      <div className="flex justify-between mt-2 text-sm">
        <span>
          {reto.progresoActual} / {reto.progresoTotal}
        </span>
        <span className="font-medium text-emerald-600">+{reto.puntos} PA</span>
      </div>

      {reclamado && (
        <p className="mt-2 text-xs text-green-700 font-medium">Recompensa reclamada</p>
      )}
    </div>
  )
}
