"use client"

import { useEffect, useRef } from "react"

type SvelteQuotaTokenElement = HTMLElement & {
  status?: string
  timeLabel?: string
  points?: number
  unit?: string
}

interface SvelteQuotaTokenProps {
  status: string
  timeLabel: string
  points: number
  unit: string
  scriptReady?: boolean
}

export function SvelteQuotaToken({
  status,
  timeLabel,
  points,
  unit,
  scriptReady = true,
}: Readonly<SvelteQuotaTokenProps>) {
  const tokenRef = useRef<SvelteQuotaTokenElement | null>(null)

  useEffect(() => {
    if (!scriptReady) return
    const el = tokenRef.current
    if (!el) return
    el.status = status
    el.timeLabel = timeLabel
    el.points = points
    el.unit = unit
  }, [status, timeLabel, points, unit, scriptReady])

  return <svelte-quota-token ref={tokenRef} />
}
