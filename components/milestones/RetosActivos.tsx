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

export function RetosActivos() {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-xl font-bold mb-2">Retos activos</h2>
      {retosMock.map((reto) => (
        <RetoCard key={reto.id} reto={reto} />
      ))}
    </div>
  )
}
