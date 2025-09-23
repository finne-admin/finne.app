// components/milestones/RetosSemanales.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { RetoCard, Reto } from './RetoCard'
import CountdownCircles from './CountdownCirclesWeekly'


/** Lunes (Europe/Madrid) como YYYY-MM-DD, robusto para SSR */
function currentWeekIdMadrid(d = new Date()) {
  const tz = 'Europe/Madrid';
  const dtf = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hourCycle: 'h23',
  });

  // Extrae partes de fecha/hora en la zona destino
  const parts = dtf.formatToParts(d).reduce<Record<string, string>>((acc, p) => {
    if (p.type !== 'literal') acc[p.type] = p.value;
    return acc;
  }, {});

  // Construye un Date en UTC que representa la hora local de Madrid
  const tzDate = new Date(Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  ));

  // Día de la semana en "hora Madrid" (0=Dom, 1=Lun, ...)
  const dow = tzDate.getUTCDay();
  const diffToMonday = (dow === 0 ? -6 : 1 - dow);

  // Ir al lunes y normalizar a 00:00
  tzDate.setUTCDate(tzDate.getUTCDate() + diffToMonday);
  tzDate.setUTCHours(0, 0, 0, 0);

  // Formato YYYY-MM-DD
  const y = tzDate.getUTCFullYear();
  const m = String(tzDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(tzDate.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}


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

      const weekId = currentWeekIdMadrid()

      // Catálogo semanal
      const { data: catalogo } = await supabase
        .from('weekly_challenges_catalog')
        .select('*')

      // Progreso SOLO de la semana actual
      const { data: progreso } = await supabase
        .from('user_weekly_challenges')
        .select('challenge_id,progreso_actual,progreso_total,completado,reclamado')
        .eq('user_id', user.id)
        .eq('week_id', weekId)

      const mapa = new Map((progreso ?? []).map(p => [p.challenge_id, p]))

      const retosConProgreso: Reto[] = (catalogo ?? []).map((item: any) => {
        const prog = mapa.get(item.id)
        return {
          id: item.id,
          titulo: item.title,
          descripcion: item.description,
          puntos: item.points, // recompensa (PA/XP)
          progresoActual: prog?.progreso_actual ?? 0,
          // Si no existe fila aún, usa goal si existe; si no, points; si no, 1
          progresoTotal: prog?.progreso_total ?? item?.goal ?? item?.points ?? 1,
          completado: prog?.completado ?? false,
          reclamado: prog?.reclamado ?? false,
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
      setOverflow(tr.scrollWidth > sc.clientWidth + 1) // +1 por redondeos
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
    <div className="mb-3 w-full">
      {/* Fila: contador izq + título centrado */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full gap-2">
        {/* Contador a la izquierda */}
        <div className="justify-self-start flex items-center">
          <div className="flex-shrink-0 scale-50 mr-2">
        <CountdownCircles target={new Date('2025-09-28T23:59:59')} />
          </div>
          {/* Aquí puedes añadir texto o icono alineado a la izquierda si lo necesitas */}
        </div>

        {/* Título centrado respecto a la página */}
        <h2 className="sub-cq font-semibold text-gray-900 text-center m-0 justify-self-center">
          Retos semanales
        </h2>

        {/* Columna derecha vacía para equilibrar (no es obligatorio rellenarla) */}
        <div />
      </div>
    </div>

    {/* Carrusel de retos (igual que lo tienes) */}
    <div
      ref={scrollRef}
      className={[
        'w-full overflow-x-auto',
        overflow
          ? 'scrollbar-thin hover:scrollbar-thumb-gray-400 scrollbar-track-transparent'
          : 'scrollbar-none',
      ].join(' ')}
    >
      <div
        ref={trackRef}
        className={[
          'flex gap-4 pb-2 snap-x snap-mandatory',
          overflow ? 'w-max justify-start px-1' : 'min-w-full justify-center px-1',
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

);

}
