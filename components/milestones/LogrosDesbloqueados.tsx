'use client'

type Logro = {
  id: string
  titulo: string
  descripcion: string
  icono: string
}

const logrosSimulados: Logro[] = [
  {
    id: 'primer_paso',
    titulo: 'Primer paso',
    descripcion: 'Realizaste tu primera pausa activa',
    icono: '👣'
  },
  {
    id: 'semana_en_pausa',
    titulo: 'Semana en pausa',
    descripcion: '5 días seguidos haciendo pausas',
    icono: '📅'
  },
  {
    id: 'reto_cardio',
    titulo: 'Cardio Express',
    descripcion: 'Completaste un reto de ejercicios cardio',
    icono: '🔥'
  }
]

export function LogrosDesbloqueados() {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 max-w-xl mx-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Logros desbloqueados</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {logrosSimulados.map((logro) => (
          <div
            key={logro.id}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition"
          >
            <div className="text-3xl">{logro.icono}</div>
            <div>
              <h4 className="text-sm font-medium text-gray-800">{logro.titulo}</h4>
              <p className="text-xs text-gray-500">{logro.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
