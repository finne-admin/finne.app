'use client'

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

type Props = {
  target?: Date | number | string
  timeZone?: string
  className?: string
  /** Tamaño fijo opcional (px). Si no se pasa, se calcula para que quepan 4 sin solaparse. */
  sizePx?: number
}

function pad2(n: number) {
  return n.toString().padStart(2, '0')
}

export default forwardRef<HTMLDivElement, Props>(function CountdownCircles(
  { target, timeZone = 'Europe/Madrid', className, sizePx },
  ref
) {
  const hostRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => hostRef.current as HTMLDivElement)

  const targetMs = useMemo(() => {
    if (target) {
      return target instanceof Date
        ? target.getTime()
        : typeof target === 'string'
        ? Date.parse(target)
        : target
    }

    // Default: next Sunday 23:59:59 in the given time zone (client-side).
    const now = new Date()
    const partsFor = (tz: string) =>
      new Intl.DateTimeFormat('en', {
        timeZone: tz,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      })
        .formatToParts(now)
        .reduce((acc: Record<string, number>, p) => {
          if (p.type !== 'literal') acc[p.type] = Number(p.value)
          return acc
        }, {})

    const utc = partsFor('UTC')
    const tzParts = partsFor(timeZone)

    // offset (ms) between tz and UTC at "now"
    const tzAsIfUTC = Date.UTC(
      tzParts.year,
      tzParts.month - 1,
      tzParts.day,
      tzParts.hour,
      tzParts.minute,
      tzParts.second
    )
    const utcAsUTC = Date.UTC(
      utc.year,
      utc.month - 1,
      utc.day,
      utc.hour,
      utc.minute,
      utc.second
    )
    const offsetMs = tzAsIfUTC - utcAsUTC

    // weekday in tz (0 = Sunday)
    const weekday = new Date(
      Date.UTC(
        tzParts.year,
        tzParts.month - 1,
        tzParts.day,
        tzParts.hour,
        tzParts.minute,
        tzParts.second
      )
    ).getUTCDay()
    const daysToAdd = (0 - weekday + 7) % 7

    // target as if the wall-clock date is UTC, then subtract offset to get real UTC timestamp
    const targetAsIfUTC = Date.UTC(
      tzParts.year,
      tzParts.month - 1,
      tzParts.day + daysToAdd,
      23,
      59,
      59
    )
    return targetAsIfUTC - offsetMs
  }, [target, timeZone])

  // ---- tiempo ----
  const [now, setNow] = useState<number>(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = Math.max(0, targetMs - now)
  const totalSec = Math.floor(diff / 1000)
  const days = Math.floor(totalSec / 86400)
  const hours = Math.floor((totalSec % 86400) / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60

  // ---- layout responsivo por ancho ----
  const [containerW, setContainerW] = useState(0)
  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      setContainerW(Math.floor(entries[0].contentRect.width))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // gap y tamaño calculados para que entren 4 círculos sin solape
  const GAP_MIN = 12
  const GAP_MAX = 24
  const gap = sizePx ? 16 : Math.max(GAP_MIN, Math.min(GAP_MAX, Math.round(containerW * 0.018)))
  const fitSize = sizePx
    ? sizePx
    : containerW > 0
    ? Math.max(64, Math.floor((containerW - 3 * gap) / 4)) // clave: 4 círculos exactos
    : 96

  // tipografías y espaciado (ajustados ↓ para verse más centrados/ligibles)
  const NUM_RATIO = 0.36   // antes 0.44
  const LBL_RATIO = 0.12   // antes 0.18
  const INNER_GAP = Math.round(fitSize * 0.05)

  const numFont = Math.round(fitSize * NUM_RATIO)
  const lblFont = Math.max(10, Math.round(fitSize * LBL_RATIO))

  const circleStyle: React.CSSProperties = {
    width: fitSize,
    height: fitSize,
    borderRadius: Math.round(fitSize * 0.18), // menos redondeado, más rectangular
  }

  const wrapperStyle: React.CSSProperties = { gap }

  const circleCls =
    'rounded-full border-2 border-emerald-300 bg-white/70 backdrop-blur-[1px] flex items-center justify-center text-center shadow-sm'

  return (
    <div
      ref={hostRef}
      className={['w-full', className].filter(Boolean).join(' ')}
      role="timer"
      aria-live="polite"
    >
      {/* centrado horizontal del conjunto */}
      <div className="w-full flex justify-center">
        <div
          className="flex items-center justify-center rounded-xl border-2 border-emerald-300 bg-white/70 backdrop-blur-[1px] shadow-sm px-6 py-4"
          style={{
            gap: gap,
            minWidth: fitSize * 4 + gap * 3,
          }}
        >
          {[{ v: days, l: '' }, { v: hours, l: '' }, { v: minutes, l: '' }, { v: seconds, l: '' }].map(
            (it, i, arr) => (
              <div key={i} className="flex flex-col items-center" style={{ gap: INNER_GAP }}>
                <div
                  className="font-extrabold text-slate-900"
                  style={{ fontSize: numFont, lineHeight: 1 }}
                >
                  {i === 0 ? it.v : pad2(it.v)}
                  {i < arr.length - 1 && (
                    <span className="mx-1 text-slate-400" style={{ fontSize: numFont * 0.8 }}>
                      :
                    </span>
                  )}
                </div>
                <div
                  className="text-slate-700 font-semibold tracking-wide"
                  style={{ fontSize: lblFont, lineHeight: 1 }}
                >
                  {it.l}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
})
