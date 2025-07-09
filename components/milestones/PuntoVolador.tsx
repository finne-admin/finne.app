'use client'

import { motion } from 'framer-motion'

interface PuntoVoladorProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
}

export function PuntoVolador({ from, to }: PuntoVoladorProps) {
  return (
    <motion.div
    className="fixed w-3 h-3 rounded-full bg-emerald-400 shadow-md shadow-emerald-500 z-50 pointer-events-none"
    initial={{
        left: from.x,
        top: from.y,
        scale: 1.2,
        opacity: 1,
    }}
    animate={{
        left: to.x,
        top: to.y,
        scale: 0.8,
        opacity: 0.5,
    }}
    transition={{
        duration: 1.4,
        ease: [0.42, 0, 0.58, 1],
    }}
    />
  )
}
