"use client"

import { useEffect, useRef } from "react"

type SvelteThermometerElement = HTMLElement & {
  label?: string
  value?: number
  min?: number
  max?: number
  subtitle?: string
  frameless?: boolean
}

interface SvelteThermometerProps {
  label?: string
  value: number
  min: number
  max: number
  subtitle?: string
  frameless?: boolean
  scriptReady?: boolean
}

export function SvelteThermometer({
  label = "Actividad",
  value,
  min,
  max,
  subtitle,
  frameless = false,
  scriptReady = true,
}: Readonly<SvelteThermometerProps>) {
  const thermoRef = useRef<SvelteThermometerElement | null>(null)

  useEffect(() => {
    if (!scriptReady) return
    const el = thermoRef.current
    if (!el) return
    el.label = label
    el.value = value
    el.min = min
    el.max = max
    el.subtitle = subtitle ?? ""
    el.frameless = frameless
  }, [label, value, min, max, subtitle, frameless, scriptReady])

  return <svelte-thermometer ref={thermoRef} />
}
