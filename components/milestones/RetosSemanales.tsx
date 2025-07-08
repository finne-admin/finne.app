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
  }
]

export function RetosSemanales() {
  return (
    <section className="overflow-x-auto pb-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-3 px-1">Retos semanales</h2>
      <div className="flex gap-4 min-w-full">
        {retosMock.map((reto) => (
          <div key={reto.id} className="min-w-[250px]">
            <RetoCard reto={reto} />
          </div>
        ))}
      </div>
    </section>
  )
}
