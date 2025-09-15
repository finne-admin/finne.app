// PiggyFixedAligned.tsx
'use client'
import Image from 'next/image'
import { useEffect, useLayoutEffect, useState } from 'react'

type Mode = 'bottomEdge' | 'centerOnBottom'

export function PiggyFixedAligned({
  src = '/ahorro.png',
  targetSelector,
  size = 240,
  right = 32,
  mode = 'bottomEdge',
  offset = 0,          // 🔹 ajuste fino (+ baja, - sube)
}: {
  src?: string
  targetSelector: string
  size?: number
  right?: number
  mode?: Mode
  offset?: number
}) {
  const [topPx, setTopPx] = useState<number | null>(null)

  const compute = () => {
    const el = document.querySelector<HTMLElement>(targetSelector)
    if (!el) return

    const rect = el.getBoundingClientRect()
    let t = mode === 'bottomEdge' ? rect.bottom - size : rect.bottom - size / 2
    t += offset
    // clamped dentro del viewport
    t = Math.max(0, Math.min(t, window.innerHeight - size))
    setTopPx(Math.round(t))
  }

  useLayoutEffect(() => {
    compute()
    const id = requestAnimationFrame(compute)
    return () => cancelAnimationFrame(id)
  }, [targetSelector, size, mode, offset])

  useEffect(() => {
    const onResize = () => compute()
    window.addEventListener('resize', onResize)

    const el = document.querySelector<HTMLElement>(targetSelector)
    const ro = el ? new ResizeObserver(compute) : null
    el && ro?.observe(el)

    return () => {
      window.removeEventListener('resize', onResize)
      ro?.disconnect()
    }
  }, [targetSelector, size, mode, offset])

  if (topPx === null) return null

  return (
    <div
      aria-hidden
      className="fixed z-50 select-none pointer-events-none"
      style={{ right, top: topPx }}
    >
      <Image src={src} alt="" width={size} height={size} priority className="opacity-90" />
    </div>
  )
}
