'use client'

import { AchievementCard, Logro } from '@/components/milestones/AchievementCard'

const todosLosLogros: Logro[] = [
  {
    id: 'primer_paso',
    titulo: 'Primer paso',
    descripcion: 'Realiza tu primera pausa activa',
    icono: '🦶',
    completado: true,
    reclamado: false,
    puntos: 10
  },
  {
    id: 'semana_en_pausa',
    titulo: 'Semana en pausa',
    descripcion: 'Haz pausas durante 5 días seguidos',
    icono: '📅',
    completado: true,
    reclamado: true,
    puntos: 20
  },
  {
    id: '21_dias',
    titulo: 'Racha de 21',
    descripcion: 'Haz pausas 21 días seguidos',
    icono: '🏅',
    completado: false,
    reclamado: false,
    puntos: 30
  },
  {
    id: 'curioso',
    titulo: 'Curioso',
    descripcion: 'Explora 3 categorías distintas de ejercicios',
    icono: '🧭',
    completado: false,
    reclamado: false,
    puntos: 15
  },
  {
    id: 'sabio',
    titulo: 'Sabio activo',
    descripcion: 'Lee 5 consejos de salud distintos',
    icono: '📖',
    completado: false,
    reclamado: false,
    puntos: 15
  }
]

export function TodosLosLogros() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
      {todosLosLogros.map((logro) => (
        <AchievementCard key={logro.id} logro={logro} />
      ))}
    </div>
  )
}
