'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'

export type Logro = {
  id: string
  titulo: string
  descripcion: string
  icono: string // Emoji o URL
  completado: boolean
  reclamado: boolean
  puntos: number
}

export function AchievementCard({ logro }: { logro: Logro }) {
  const [reclamado, setReclamado] = useState(logro.reclamado)
  const [animando, setAnimando] = useState(false)

  const handleClick = async () => {
    if (!logro.completado || reclamado) return

    setAnimando(true)
    setTimeout(() => {
      setReclamado(true)
      setAnimando(false)
      // Aquí puedes disparar una animación, toast, sumar puntos, etc.
      // Por ejemplo: toast.success(`+${logro.puntos} PA por "${logro.titulo}"`)
    }, 1000)
  }

  const esBloqueado = !logro.completado && !reclamado
  const esCompletado = logro.completado && !reclamado
  const esReclamado = reclamado

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl border shadow-sm transition-all cursor-pointer max-w-md w-full',
        esBloqueado && 'bg-muted text-muted-foreground cursor-default',
        esCompletado &&
          'bg-yellow-100 border-yellow-400 hover:border-yellow-500 ring-1 ring-yellow-300',
        esReclamado && 'bg-white border border-gray-200',
        animando && 'animate-pulse'
      )}
    >
      <div className="text-3xl">{logro.icono}</div>
      <div className="flex-1">
        <h3 className="font-semibold">
          {logro.titulo}{' '}
          {esCompletado && !animando && (
            <span className="text-xs text-yellow-800 bg-yellow-200 px-2 py-0.5 rounded ml-2">
              ¡Completado!
            </span>
          )}
        </h3>
        <p className="text-sm text-muted-foreground">{logro.descripcion}</p>
      </div>
      {esReclamado && (
        <div className="text-sm text-green-600 font-semibold">+{logro.puntos} PA</div>
      )}
    </div>
  )
}
