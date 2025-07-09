'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PuntoVoladorProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
}

export function PuntoVolador({ from, to }: PuntoVoladorProps) {
  const [control, setControl] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    // Calcular vector desde origen a destino
    const dx = to.x - from.x
    const dy = to.y - from.y

    // Perpendicular hacia una dirección aleatoria (izquierda o derecha)
    const normalX = -dy
    const normalY = dx

    const magnitude = Math.sqrt(normalX * normalX + normalY * normalY)
    const unitX = normalX / magnitude
    const unitY = normalY / magnitude

    // Factor de curvatura: mayor = más arco
    const curvature = 100 + Math.random() * 50
    const sign = Math.random() < 0.5 ? -1 : 1

    const cx = from.x + dx / 2 + unitX * curvature * sign
    const cy = from.y + dy / 2 + unitY * curvature * sign

    setControl({ x: cx, y: cy })
  }, [from, to])

  if (!control) return null

  return (
    <motion.div
      className="fixed w-3 h-3 rounded-full bg-emerald-400 shadow-md shadow-emerald-500 z-50 pointer-events-none"
      initial={{
        x: from.x,
        y: from.y,
        scale: 1.2,
        opacity: 1,
      }}
      animate={{
        x: [from.x, control.x, to.x],
        y: [from.y, control.y, to.y],
        scale: [1.2, 1, 0.8],
        opacity: [1, 0.8, 0.3, 0],
      }}
      transition={{
        duration: 1.3,
        ease: 'easeInOut',
      }}
    />
  )
}
