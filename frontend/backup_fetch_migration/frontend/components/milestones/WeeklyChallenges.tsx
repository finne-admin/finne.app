// components/milestones/RetosSemanales.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { RetoCard, Reto } from './WeeklyAchievementCard'
import CountdownCircles from './WeeklyCountdownCircles'

type WeeklyConditionType =
  | 'pausas_semana'
  | 'ejercicios_brazos'
  | 'ejercicios_piernas'
  | 'ejercicios_core'
  | 'ejercicios_movilidad';

const SUPPORTED: WeeklyConditionType[] = [
  'pausas_semana',
  'ejercicios_brazos',
  'ejercicios_piernas',
  'ejercicios_core',
  'ejercicios_movilidad',
]

/** Lunes (Europe/Madrid) como YYYY-MM-DD */
function currentWeekIdMadrid(d = new Date()) {
  const tz = 'Europe/Madrid';
  const dtf = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  });
  const parts = dtf.formatToParts(d).reduce<Record<string,string>>((acc, p) => {
    if (p.type !== 'literal') acc[p.type] = p.value;
    return acc;
  }, {});
  const tzDate = new Date(Date.UTC(
    Number(parts.year), Number(parts.month)-1, Number(parts.day),
    Number(parts.hour), Number(parts.minute), Number(parts.second)
  ));
  const dow = tzDate.getUTCDay();
  const diffToMonday = (dow === 0 ? -6 : 1 - dow);
  tzDate.setUTCDate(tzDate.getUTCDate() + diffToMonday);
  tzDate.setUTCHours(0,0,0,0);
  const y = tzDate.getUTCFullYear();
  const m = String(tzDate.getUTCMonth()+1).padStart(2,'0');
  const day = String(tzDate.getUTCDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

/** PRNG simple (xorshift32) */
function seededShuffle<T>(arr: T[], seedStr: string): T[] {
  let x = 0;
  // hash sencillo a partir del string
  for (let i=0; i<seedStr.length; i++) {
    x = (x ^ seedStr.charCodeAt(i)) >>> 0;
    x = (x + ((x<<7) | 0)) >>> 0;
  }
  if (x === 0) x = 1337;

  const rnd = () => {
    // xorshift32
    x ^= x << 13; x >>>= 0;
    x ^= x >>> 17; x >>>= 0;
    x ^= x << 5;  x >>>= 0;
    return (x >>> 0) / 0xFFFFFFFF;
  };

  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function RetosSemanales() {
  const [retos, setRetos] = useState<Reto[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [overflow, setOverflow] = useState(false)

  useEffect(() => {
    const fetchRetos = async () => {
      const supabase = createClientComponentClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const weekId = currentWeekIdMadrid()

      // 1) Catálogo soportado
      const { data: catalogo } = await supabase
        .from('weekly_challenges_catalog')
        .select('id,title,description,points,condition_type,goal')

      const soportados = (catalogo ?? []).filter((c: any) =>
        SUPPORTED.includes(c.condition_type) && typeof c.goal === 'number' && c.goal > 0
      )

      // 2) Selección determinista de 6 para esta semana
      const elegidos = seededShuffle(soportados, weekId).slice(0, 5)
      const elegidosIds = elegidos.map(c => c.id)

      // 3) Progreso sólo de los elegidos y de la semana actual
      const { data: progreso } = await supabase
        .from('user_weekly_challenges')
        .select('challenge_id,progreso_actual,progreso_total,completado,reclamado')
        .eq('user_id', user.id)
        .eq('week_id', weekId)
        .in('challenge_id', elegidosIds)

      const mapa = new Map((progreso ?? []).map(p => [p.challenge_id, p]))

      const retosConProgreso: Reto[] = elegidos.map((item: any) => {
        const prog = mapa.get(item.id)
        return {
          id: item.id,
          titulo: item.title,
          descripcion: item.description,
          puntos: item.points,
          progresoActual: prog?.progreso_actual ?? 0,
          progresoTotal: prog?.progreso_total ?? item.goal ?? 1,
          completado: prog?.completado ?? false,
          reclamado: prog?.reclamado ?? false,
        }
      })

      setRetos(retosConProgreso)
    }

    fetchRetos()
  }, [])

  // ——— Layout: overflow ———
  useEffect(() => {
    const update = () => {
      const sc = scrollRef.current
      const tr = trackRef.current
      if (!sc || !tr) return
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
      <div className="mb-3 w-full">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full gap-2">
          <div className="justify-self-start flex items-center">
            <div className="flex-shrink-0 scale-50 mr-2">
              <CountdownCircles target={new Date('2025-10-05T23:59:59')} />
            </div>
          </div>
          <h2 className="sub-cq font-semibold text-gray-900 text-center m-0 justify-self-center">
            Retos semanales
          </h2>
          <div />
        </div>
      </div>

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
  )
}
