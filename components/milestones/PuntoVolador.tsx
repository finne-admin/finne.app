'use client'

import { useEffect, useRef, useState } from 'react'

interface PuntoVoladorProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
}

export function PuntoVolador({ from, to }: PuntoVoladorProps) {
  const [show, setShow] = useState(true)
  const [pathId] = useState(() => `path-${crypto.randomUUID()}`)

  // Ocultar tras la animación
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(false)
    }, 1600)
    return () => clearTimeout(timeout)
  }, [])

  if (!show) return null
  if (!from || !to || isNaN(from.x) || isNaN(to.x)) return null

  const controlOffsetX = (Math.random() > 0.5 ? -1 : 1) * 100
  const controlOffsetY = (Math.random() > 0.5 ? -1 : 1) * 100

  const cx = from.x + controlOffsetX
  const cy = from.y + controlOffsetY

  return (
    <svg className="fixed left-0 top-0 w-full h-full pointer-events-none z-50" style={{ overflow: 'visible' }}>
      {/* Trayectoria curva */}
      <path
        id={pathId}
        d={`M${from.x},${from.y} Q${cx},${cy} ${to.x},${to.y}`}
        fill="none"
        stroke="transparent"
      />

      {/* Punto animado */}
      <circle r="6" fill="url(#grad)" opacity="0.8">
        <animateMotion
          dur="1.4s"
          begin="0s"
          fill="freeze"
          keySplines="0.2 0 0.2 1"
          keyTimes="0;1"
          calcMode="spline"
        >
          <mpath xlinkHref={`#${pathId}`} />
        </animateMotion>

        {/* Desvanecimiento */}
        <animate
          attributeName="opacity"
          from="0.8"
          to="0"
          dur="1.4s"
          begin="0s"
          fill="freeze"
        />
        <animate
          attributeName="r"
          from="6"
          to="3"
          dur="1.4s"
          begin="0s"
          fill="freeze"
        />
      </circle>

      {/* Estela suave */}
      <defs>
        <radialGradient id="grad" r="50%" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="1" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}
