'use client'

import { useEffect, useRef, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { RetoCard, Reto } from './RetoCard'

export function RetosSemanales() {
  const [retos, setRetos] = useState<Reto[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [overflow, setOverflow] = useState(false)

  // ——— Data ———
  useEffect(() => {
    const fetchRetos = async () => {
      const supabase = createClientComponentClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: catalogo } = await supabase
        .from('weekly_challenges_catalog')
        .select('*')

      const { data: progreso } = await supabase
        .from('user_weekly_challenges')
        .select('challenge_id,progreso_actual,progreso_total,completado,reclamado')
        .eq('user_id', user.id)

      const mapa = new Map(progreso?.map(p => [p.challenge_id, p]))
      const retosConProgreso: Reto[] = (catalogo ?? []).map(item => {
        const prog = mapa.get(item.id)
        return {
          id: item.id,
          titulo: item.title,
          descripcion: item.description,
          puntos: item.points,
          progresoActual: prog?.progreso_actual ?? 0,
          progresoTotal:  prog?.progreso_total  ?? 1,
          completado:     prog?.completado      ?? false,
          reclamado:      prog?.reclamado       ?? false,
        }
      })
      setRetos(retosConProgreso)
    }
    fetchRetos()
  }, [])

  // ——— Layout: detectar overflow y centrar cuando cabe ———
  useEffect(() => {
    const update = () => {
      const sc = scrollRef.current
      const tr = trackRef.current
      if (!sc || !tr) return
      // +1px de margen para evitar falsos positivos por redondeos
      setOverflow(tr.scrollWidth > sc.clientWidth + 1)
    }
    update()

    const ro = new ResizeObserver(update)
    if (scrollRef.current) ro.observe(scrollRef.current)
    if (trackRef.current) ro.observe(trackRef.current)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [retos.length])

  return (
    <section className="w-full pb-4">
      <h2 className="sub-cq font-semibold text-gray-900 mb-3 text-center">
        Retos semanales
      </h2>

      {/* Contenedor de scroll a ancho completo. 
          Quita -mx/px si no quieres 'bleed' hasta los bordes del layout. */}
      <div
        ref={scrollRef}
        className={[
          'w-full overflow-x-auto',
          overflow ? 'scrollbar-thin hover:scrollbar-thumb-gray-400 scrollbar-track-transparent' : 'scrollbar-none',
        ].join(' ')}
      >
        <div
          ref={trackRef}
          className={[
            'flex gap-4 pb-2 snap-x snap-mandatory',
            // Si hay overflow: la pista crece al contenido y se alinea a la izquierda
            overflow ? 'w-max justify-start px-1'
                     // Si NO hay overflow: la pista ocupa TODO el ancho y centra las tarjetas
                     : 'min-w-full justify-center px-1',
          ].join(' ')}
        >
          {retos.map((reto) => (
            <div key={reto.id} className="min-w-[260px] snap-start">
              <RetoCard reto={reto} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
