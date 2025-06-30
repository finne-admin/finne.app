'use client'

import { useState } from 'react'
import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const usuarios = [
  { id: 1, nombre: 'Marta Sánchez', puntos: 1380 },
  { id: 2, nombre: 'Pedro López', puntos: 1275 },
  { id: 3, nombre: 'Carla Vidal', puntos: 1240 },
  { id: 4, nombre: 'Luis Romero', puntos: 1160 },
  { id: 5, nombre: 'Elena Torres', puntos: 1100 },
  { id: 6, nombre: 'David Martínez', puntos: 1050 },
  { id: 7, nombre: 'Andrea Ruiz', puntos: 970 },
  { id: 8, nombre: 'Jorge Navarro', puntos: 930 },
  { id: 9, nombre: 'Lucía Pérez', puntos: 920 },
  { id: 10, nombre: 'Carlos Gómez', puntos: 900 }
]

const miPosicion = 18
const totalUsuarios = 42

export function RankingUsuarios() {
  const [haloTop1, setHaloTop1] = useState(false)

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-bold mb-4">Ranking mensual</h2>
      <div className="divide-y">
        {usuarios.map((usuario, index) => {
          const isTop3 = index < 3
          const Wrapper: any = isTop3 ? motion.div : 'div'

          const props = isTop3
            ? {
                initial: { opacity: 0, y: -10, scale: index === 0 ? 1.2 : 1 },
                animate: index === 0
                  ? {
                      opacity: 1,
                      y: 0,
                      scale: [1, 1.03, 1],
                      boxShadow: [
                        '0 0 0px rgba(255, 215, 0, 0)',
                        '0 0 10px rgba(255, 215, 0, 0.4)',
                        '0 0 0px rgba(255, 215, 0, 0)'
                      ]
                    }
                  : { opacity: 1, y: 0, scale: 1 },
                transition: {
                  duration: index === 0 ? 2 : 0.6,
                  delay: index * 0.3,
                  repeat: index === 0 ? 0 : 0, // solo una vez
                  type: index === 0 ? 'tween' : 'spring',
                  stiffness: index === 0 ? undefined : 500,
                  damping: index === 0 ? undefined : 10
                },
                onAnimationComplete: () => {
                  if (index === 0) setHaloTop1(true)
                }
              }
            : {}

          return (
            <Wrapper
              key={usuario.id}
              {...props}
              className={cn(
                'flex justify-between items-center py-3 px-2 transition-all',
                index === 0 && haloTop1 && 'bg-yellow-50 ring-2 ring-yellow-400 shadow-md',
                index === 1 && 'bg-gray-100',
                index === 2 && 'bg-orange-50'
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold w-5 text-right">
                  {index + 1}
                </span>
                {isTop3 && <Trophy className="h-4 w-4 text-yellow-500" />}
                <span className="text-sm text-gray-800">{usuario.nombre}</span>
              </div>
              <div className="text-sm font-medium text-emerald-600">{usuario.puntos} PA</div>
            </Wrapper>
          )
        })}
      </div>

      <motion.div
        className="mt-6 text-sm text-gray-600 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Estás en el puesto <strong>{miPosicion}</strong> de {totalUsuarios}
      </motion.div>
    </div>
  )
}
