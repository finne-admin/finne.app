'use client'
import { useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

type Props = {
  open: boolean
  streak: number
  onClose: () => void
  /** ms hasta autocierre (0 = no auto) */
  autoCloseMs?: number
  /** confetti externo opcional */
  onShowConfetti?: () => void
  /** texto secundario bajo el número */
  subtitle?: string
}

export default function StreakPopup({
  open,
  streak,
  onClose,
  autoCloseMs = 5000,
  onShowConfetti,
  subtitle = '¡Sigue así, estás on fire!',
}: Props) {
  // Auto-cerrar
  useEffect(() => {
    if (!open || autoCloseMs <= 0) return
    const t = setTimeout(onClose, autoCloseMs)
    return () => clearTimeout(t)
  }, [open, autoCloseMs, onClose])

  // ESC para cerrar
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Confetti opcional al abrir
  useEffect(() => {
    if (open && onShowConfetti) onShowConfetti()
  }, [open, onShowConfetti])

  const stop = useCallback((e: React.MouseEvent) => e.stopPropagation(), [])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Card */}
          <motion.div
            onClick={stop}
            className="relative z-[9999] w-[min(520px,90vw)] rounded-3xl bg-white shadow-2xl p-6 sm:p-8 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 4 }}
            transition={{ type: 'spring', stiffness: 240, damping: 18 }}
          >
            {/* Botón cerrar */}
            <button
              aria-label="Cerrar"
              onClick={onClose}
              className="absolute top-3 right-3 rounded-full p-2 hover:bg-gray-100 active:scale-95 transition"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>

            {/* Glows suaves */}
            <div className="pointer-events-none absolute -top-40 -left-24 w-96 h-96 rounded-full bg-amber-300/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-24 w-96 h-96 rounded-full bg-emerald-300/25 blur-3xl" />

            {/* Anillo expansivo muy sutil */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-400/40"
              style={{ width: 48, height: 48 }}
              initial={{ scale: 0.35, opacity: 0.9 }}
              animate={{ scale: 6.5, opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />

            {/* Sello (más grande) */}
            <motion.div
              className="relative mx-auto mt-3 mb-3 flex h-36 w-36 sm:h-40 sm:w-40 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-emerald-400 shadow-lg"
              initial={{ scale: 0.2, rotate: -15, opacity: 0 }}
              animate={{ scale: [0.2, 1.12, 1], rotate: [-15, 2, 0], opacity: 1 }}
              transition={{ times: [0, 0.6, 1], duration: 0.7, ease: 'backOut' }}
            >
              {/* Aro blanco más grueso */}
              <motion.div
                className="absolute inset-0 rounded-full ring-8 ring-white/70"
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
              />
              {/* Brillo radial interior */}
              <div className="pointer-events-none absolute inset-0 rounded-full"
                   style={{
                     background: 'radial-gradient(closest-side, rgba(255,255,255,0.55), rgba(255,255,255,0) 70%)'
                   }}
              />
              {/* Icono fuego más grande */}
              <span className="text-white drop-shadow text-5xl sm:text-6xl font-extrabold select-none">
                🔥
              </span>
            </motion.div>

            {/* Número y textos */}
            <motion.div
              key={streak}
              className="text-center"
              initial={{ scale: 0.96, opacity: 0, y: 4 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 250, damping: 16, delay: 0.05 }}
            >
              <div className="text-6xl sm:text-7xl font-extrabold tracking-tight text-emerald-600">
                {streak}
              </div>
              <div className="mt-1 text-base sm:text-lg font-semibold text-gray-800">
                días de racha
              </div>
              <div className="mt-1 text-sm text-gray-500">{subtitle}</div>
            </motion.div>

            {/* Shine superior */}
            <motion.div
              className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[120%] -translate-x-1/2 rotate-6 bg-gradient-to-b from-white/70 to-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
