'use client'

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
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-bold mb-4">Ranking mensual</h2>
      <div className="divide-y">
        {usuarios.map((usuario, index) => {
          const Wrapper: any = index < 3 ? motion.div : 'div'
          const props = index < 3
            ? {
                initial: { scale: 0.9, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                transition: { type: 'spring', stiffness: 300, damping: 20 }
              }
            : {}

          return (
            <Wrapper
              key={usuario.id}
              {...props}
              className={cn(
                'flex justify-between items-center py-3 px-2',
                index === 0 && 'bg-yellow-50',
                index === 1 && 'bg-gray-100',
                index === 2 && 'bg-orange-50'
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold w-5 text-right">
                  {index + 1}
                </span>
                {index < 3 && <Trophy className="h-4 w-4 text-yellow-500" />}
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
