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
  /** si quieres disparar confetti externo */
  onShowConfetti?: () => void
  /** texto secundario bajo el número */
  subtitle?: string
}

/**
 * Popup “stamp” para celebrar rachas.
 * - Pop de escala + halo + destellos + glow.
 * - Cierra con click fuera, botón X o ESC.
 */
export default function StreakPopup({
  open,
  streak,
  onClose,
  autoCloseMs = 2200,
  onShowConfetti,
  subtitle = '¡Racha conseguida!',
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
            initial={{ scale: 0.85, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 5 }}
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

            {/* Glow de fondo */}
            <div className="pointer-events-none absolute -top-40 -left-24 w-96 h-96 rounded-full bg-amber-300/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-24 w-96 h-96 rounded-full bg-emerald-300/25 blur-3xl" />

            {/* Anillo expansivo */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-400/50"
              style={{ width: 40, height: 40 }}
              initial={{ scale: 0.3, opacity: 0.9 }}
              animate={{ scale: 6, opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />

            {/* Partículas simples (4 rayos) */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.span
                key={i}
                className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-12 origin-left rounded-full bg-amber-400/70"
                style={{ transform: `rotate(${(360 / 8) * i}deg)` }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.08 + i * 0.03, duration: 0.35, ease: 'easeOut' }}
              />
            ))}

            {/* Sello */}
            <motion.div
              className="relative mx-auto mt-2 mb-2 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-emerald-400 shadow-lg"
              initial={{ scale: 0.2, rotate: -15, opacity: 0 }}
              animate={{ scale: [0.2, 1.15, 1], rotate: [ -15, 2, 0], opacity: 1 }}
              transition={{ times: [0, 0.6, 1], duration: 0.7, ease: 'backOut' }}
            >
              <motion.div
                className="absolute inset-0 rounded-full ring-4 ring-white/60"
                initial={{ scale: 1.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
              />
              <span className="text-white drop-shadow text-3xl font-extrabold select-none">🔥</span>
            </motion.div>

            {/* Número grande */}
            <motion.div
              key={streak}
              className="text-center"
              initial={{ scale: 0.95, opacity: 0, y: 4 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 250, damping: 16, delay: 0.05 }}
            >
              <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-emerald-600">
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
