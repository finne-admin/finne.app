'use client'

import { RetoCard, Reto } from './RetoCard'

const retosMock: Reto[] = [
  {
    id: 'pausas_5',
    titulo: 'Haz 5 pausas activas',
    descripcion: 'Completa 5 pausas activas esta semana.',
    progresoActual: 3,
    progresoTotal: 5,
    puntos: 50,
    completado: false,
    reclamado: false
  },
  {
    id: 'consejos_3',
    titulo: 'Lee 3 consejos de salud',
    descripcion: 'Consulta al menos 3 consejos distintos en la sección de ayuda.',
    progresoActual: 3,
    progresoTotal: 3,
    puntos: 30,
    completado: true,
    reclamado: false
  },
  {
    id: 'racha_7',
    titulo: 'Mantén una racha de 7 días',
    descripcion: 'Realiza pausas durante 7 días seguidos.',
    progresoActual: 7,
    progresoTotal: 7,
    puntos: 100,
    completado: true,
    reclamado: true
  },
  {
    id: 'cosas_nuevas',
    titulo: 'Explora cosas nuevas',
    descripcion: 'Prueba 3 categorías distintas de ejercicios.',
    progresoActual: 3,
    progresoTotal: 3,
    puntos: 30,
    completado: true,
    reclamado: false
  },
  {
    id: 'reto_cardio',
    titulo: 'Cardio Express',
    descripcion: 'Completa un reto de ejercicios cardio.',
    progresoActual: 1,
    progresoTotal: 1,
    puntos: 40,
    completado: false,
    reclamado: false
  }
]

export function RetosSemanales() {
  return (
    <section className="pb-4 max-w-6xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-3 px-1">Retos semanales</h2>
      <div className="overflow-x-auto group">
        <div className="flex gap-4 px-1 min-w-full w-max pb-2 group-hover:scrollbar-thumb-gray-400 scrollbar-thumb-transparent scrollbar-track-transparent scrollbar-thin">
          {retosMock.map((reto) => (
            <div key={reto.id} className="min-w-[250px]">
              <RetoCard reto={reto} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
