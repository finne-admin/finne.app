'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PuntoVoladorProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
}

export function PuntoVolador({ from, to }: PuntoVoladorProps) {
  const [pathId] = useState(() => `path-${Math.random().toString(36).slice(2)}`)
  const [show, setShow] = useState(true)

  // Curvatura controlada
  const controlX = from.x + (Math.random() * 300 - 150)
  const controlY = from.y - 200
  const path = `M ${from.x} ${from.y} Q ${controlX} ${controlY}, ${to.x} ${to.y}`

  // Ocultar punto después del vuelo
  useEffect(() => {
    const timeout = setTimeout(() => setShow(false), 1400)
    return () => clearTimeout(timeout)
  }, [])

  if (!show) return null

  return (
    <svg className="fixed top-0 left-0 w-full h-full pointer-events-none z-50" style={{ overflow: 'visible' }}>
      <motion.circle
        r={6 + Math.random() * 3}
        fill="url(#puntoGradient)"
        style={{
          filter: 'blur(1px) drop-shadow(0 0 4px rgba(16,185,129,0.8))',
        }}
        initial={{ opacity: 1, scale: 1.1 }}
        animate={{ opacity: 0, scale: 0.7 }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
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
        stroke="transparent"
        strokeWidth="2"
      />

      <defs>
        <radialGradient id="puntoGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#10b981" />
        </radialGradient>
      </defs>
    </svg>
  )
}
