'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type Logro = {
  id: string
  titulo: string
  descripcion: string
  icono: string
  desbloqueado: boolean
}

const todosLosLogros: Logro[] = [
  {
    id: 'primer_paso',
    titulo: 'Primer paso',
    descripcion: 'Realiza tu primera pausa activa',
    icono: '🦶',
    desbloqueado: true
  },
  {
    id: 'semana_en_pausa',
    titulo: 'Semana en pausa',
    descripcion: 'Haz pausas durante 5 días seguidos',
    icono: '📅',
    desbloqueado: true
  },
  {
    id: '21_dias',
    titulo: 'Racha de 21',
    descripcion: 'Haz pausas 21 días seguidos',
    icono: '🏅',
    desbloqueado: false
  },
  {
    id: 'curioso',
    titulo: 'Curioso',
    descripcion: 'Explora 3 categorías distintas de ejercicios',
    icono: '🧭',
    desbloqueado: false
  },
  {
    id: 'sabio',
    titulo: 'Sabio activo',
    descripcion: 'Lee 5 consejos de salud distintos',
    icono: '📖',
    desbloqueado: false
  }
]

export function TodosLosLogros() {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {todosLosLogros.map((logro) => (
          <Tooltip key={logro.id}>
            <TooltipTrigger asChild>
              <div
                className={`flex items-start gap-3 p-4 rounded-xl border transition 
                ${logro.desbloqueado 
                  ? 'bg-white border-gray-200 shadow hover:shadow-md' 
                  : 'bg-gray-100 border-gray-200 opacity-60 cursor-default'
                }`}
              >
                <div className="text-3xl bg-white rounded-lg w-12 h-12 flex items-center justify-center shadow-inner">
                  {logro.icono}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">{logro.titulo}</h4>
                  <p className="text-xs text-gray-500">{logro.descripcion}</p>
                </div>
              </div>
            </TooltipTrigger>
            {!logro.desbloqueado && (
              <TooltipContent>
                <p>Aún no desbloqueado</p>
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
