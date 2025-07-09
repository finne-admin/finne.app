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
        'p-4 rounded-xl border shadow-sm transition-all cursor-pointer max-w-xs w-full h-[160px] flex flex-col justify-between',
        puedeReclamar && 'bg-green-50 border-green-400',
        reclamado && 'bg-white border-gray-200',
        !reto.completado && 'bg-muted/20 text-muted-foreground cursor-default'
      )}
    >
      <div>
        <h3 className="text-sm font-semibold mb-1 leading-tight">{reto.titulo}</h3>
        <p className="text-xs text-gray-600">{reto.descripcion}</p>
      </div>

      <div className="mt-2">
        <Progress value={progresoPorcentaje} className="h-2" />
        <div className="flex justify-between items-center mt-1 text-xs">
          <span>{reto.progresoActual} / {reto.progresoTotal}</span>
          <span className="font-semibold text-emerald-600">+{reto.puntos} PA</span>
        </div>
        <div className="text-[11px] h-4 mt-1 text-green-700 font-medium">
          {reclamado ? 'Recompensa reclamada' : ''}
        </div>
      </div>
    </div>
  )
}
