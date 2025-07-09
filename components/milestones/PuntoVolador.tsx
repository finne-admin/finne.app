'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PuntoVoladorProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
}

export function PuntoVolador({ from, to }: PuntoVoladorProps) {
  const [startOffset, setStartOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Desviación inicial aleatoria (dirección "contraria")
    const angle = Math.random() * Math.PI * 2
    const distance = 80 + Math.random() * 40
    const offsetX = Math.cos(angle) * distance
    const offsetY = Math.sin(angle) * distance
    setStartOffset({ x: offsetX, y: offsetY })
  }, [])

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
        x: [from.x, from.x + startOffset.x, to.x],
        y: [from.y, from.y + startOffset.y, to.y],
        scale: [1.2, 1, 0.8],
        opacity: [1, 0.8, 0],
      }}
      transition={{
        duration: 1.4,
        ease: 'easeInOut',
      }}
    />
  )
}
