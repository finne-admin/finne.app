'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PuntoVoladorProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
}

export function PuntoVolador({ from, to }: PuntoVoladorProps) {
  const [pathId] = useState(() => `path-${Math.random().toString(36).slice(2)}`)

  const controlX = from.x + (Math.random() * 300 - 150) // curva lateral aleatoria
  const controlY = from.y - 200 // curva hacia arriba

  const path = `M ${from.x} ${from.y} Q ${controlX} ${controlY}, ${to.x} ${to.y}`

  return (
    <svg className="fixed top-0 left-0 w-full h-full pointer-events-none z-50" style={{ overflow: 'visible' }}>
      <motion.circle
        r="6"
        fill="#34d399" // emerald-400
        stroke="#10b981"
        strokeWidth="1"
      >
        <animateMotion
          dur="1.4s"
          repeatCount="1"
          fill="freeze"
          keyPoints="0;1"
          keyTimes="0;1"
        >
          <mpath xlinkHref={`#${pathId}`} />
        </animateMotion>
      </motion.circle>

      <path
        id={pathId}
        d={path}
        fill="none"
        stroke="transparent" // Debug: cambia a 'red' si quieres ver el path
        strokeWidth="2"
      />
    </svg>
  )
}
