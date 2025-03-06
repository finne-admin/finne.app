"use client"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface CountdownTimerProps {
  countdown: number
  totalTime: number
  onSkip?: () => void
}

export function CountdownTimer({ countdown, totalTime, onSkip }: CountdownTimerProps) {
  const progress = (countdown / totalTime) * 100

  return (
      <AnimatePresence>
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <div className="bg-white p-8 rounded-2xl text-center text-gray-900 space-y-6 shadow-lg max-w-sm w-full mx-4">
            <h2 className="text-2xl font-bold">Descanso Breve</h2>
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                    className="text-gray-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="44"
                    cx="50"
                    cy="50"
                />
                <motion.circle
                    className="text-green-500"
                    strokeWidth="8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="44"
                    cx="50"
                    cy="50"
                    initial={{ pathLength: 1 }}
                    animate={{ pathLength: progress / 100 }}
                    transition={{ duration: 1, ease: "linear" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                    key={countdown}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="text-4xl font-bold"
                >
                  {countdown}
                </motion.span>
              </div>
            </div>
            <p className="text-gray-600 text-lg">Prepárate para el siguiente ejercicio</p>
            <div className="flex justify-center space-x-4">
              <button
                  onClick={onSkip}
                  className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                      "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  )}
              >
                Saltar
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
  )
}