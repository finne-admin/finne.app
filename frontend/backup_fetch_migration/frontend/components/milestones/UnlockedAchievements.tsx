'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type Logro = {
  id: string
  titulo: string
  descripcion: string
  icono: string
}

export function LogrosDesbloqueados() {
  const [logros, setLogros] = useState<Logro[]>([])

  useEffect(() => {
    const fetchLogros = async () => {
      const supabase = createClientComponentClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 1. Traer solo los logros completados del usuario
      const { data, error } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', user.id)
        .eq('completado', true)

      if (error) {
        console.error('Error al cargar logros completados:', error)
        return
      }

      const idsLogros = data?.map(l => l.achievement_id)

      if (!idsLogros || idsLogros.length === 0) {
        setLogros([])
        return
      }

      // 2. Traer los datos del catálogo para esos logros
      const { data: catalogo, error: catalogoError } = await supabase
        .from('achievements_catalog')
        .select('id, title, description, icon')
        .in('id', idsLogros)

      if (catalogoError) {
        console.error('Error al cargar logros del catálogo:', catalogoError)
        return
      }

      const logrosConvertidos: Logro[] = catalogo.map((item) => ({
        id: item.id,
        titulo: item.title,
        descripcion: item.description,
        icono: item.icon
      }))

      setLogros(logrosConvertidos)
    }

    fetchLogros()
  }, [])

  return (
    <section className="max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Logros desbloqueados</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {logros.map((logro) => (
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
