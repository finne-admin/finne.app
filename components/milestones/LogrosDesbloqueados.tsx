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
    icono: '🦶'
  },
  {
    id: 'semana_en_pausa',
    titulo: 'Semana en pausa',
    descripcion: '5 días seguidos haciendo pausas',
    icono: '🗓️'
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
    <section className="max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Logros desbloqueados</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {logrosSimulados.map((logro) => (
          <div
            key={logro.id}
            className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow transition"
          >
            <div className="text-3xl bg-white rounded-lg w-12 h-12 flex items-center justify-center shadow-inner">
              {logro.icono}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800">{logro.titulo}</h4>
              <p className="text-xs text-gray-500">{logro.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
