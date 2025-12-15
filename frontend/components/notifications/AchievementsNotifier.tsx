// components/notifications/AchievementsNotifier.tsx
'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { apiGet } from '@/lib/apiClient'

// 🎉 util: disparar confetti (import dinámico para evitar SSR issues)
async function fireConfetti(preset: 'ready' | 'claimed' = 'ready') {
  const confetti = (await import('canvas-confetti')).default

  const base = { spread: 70, startVelocity: 45, ticks: 180, gravity: 0.9 }
  const colorsReady = ['#34d399', '#10b981', '#6ee7b7', '#a7f3d0']
  const colorsClaim = ['#f59e0b', '#fbbf24', '#f87171', '#fde68a']

  if (preset === 'ready') {
    confetti({ ...base, particleCount: 70, origin: { x: 0.2, y: 0.2 }, colors: colorsReady })
    confetti({ ...base, particleCount: 70, origin: { x: 0.8, y: 0.2 }, colors: colorsReady })
  } else {
    // un poco más épico al reclamar
    confetti({ ...base, particleCount: 120, origin: { x: 0.5, y: 0.2 }, colors: colorsClaim, spread: 90 })
    setTimeout(() => confetti({ ...base, particleCount: 80, origin: { x: 0.2, y: 0.3 }, colors: colorsClaim }), 150)
    setTimeout(() => confetti({ ...base, particleCount: 80, origin: { x: 0.8, y: 0.3 }, colors: colorsClaim }), 300)
  }
}

type WeeklyState = {
  id: string
  titulo: string
  puntos: number
  completado: boolean
  reclamado: boolean
}

type AchievementState = {
  id: string
  titulo: string
  puntos: number
  completado: boolean
  reclamado: boolean
}

export default function AchievementsNotifier() {
  const router = useRouter()

  const weeklyPrev = useRef<Map<string, WeeklyState>>(new Map())
  const achievementsPrev = useRef<Map<string, AchievementState>>(new Map())
  const notified = useRef<Set<string>>(new Set())

  useEffect(() => {
    let mounted = true
    const POLL_INTERVAL = 15000

    const once = (key: string) => {
      if (notified.current.has(key)) return false
      notified.current.add(key)
      return true
    }

    const processWeekly = (list: WeeklyState[]) => {
      list.forEach((item) => {
        const previous = weeklyPrev.current.get(item.id)
        const wasReady = !!previous?.completado && !previous?.reclamado
        const nowReady = !!item.completado && !item.reclamado
        const justClaimed = !!item.reclamado && !previous?.reclamado

        if (!wasReady && nowReady) {
          const key = `weekly-ready-${item.id}`
          if (once(key)) {
            toast.success("¡Reto semanal completado!", {
              description: item.titulo,
              duration: 5000,
              action: {
                label: "Ver",
                onClick: () => router.push("/milestones"),
              },
            })
            fireConfetti("ready").catch(() => {})
          }
        }

        if (justClaimed) {
          const key = `weekly-claimed-${item.id}`
          if (once(key)) {
            const pts = item.puntos ? ` +${item.puntos} PA` : ""
            toast("¡Recompensa reclamada!", {
              description: `${item.titulo}${pts}`,
              duration: 5000,
              action: {
                label: "Ver",
                onClick: () => router.push("/milestones"),
              },
            })
            fireConfetti("claimed").catch(() => {})
          }
        }

        weeklyPrev.current.set(item.id, item)
      })
    }

    const processAchievements = (list: AchievementState[]) => {
      list.forEach((item) => {
        const previous = achievementsPrev.current.get(item.id)
        const wasReady = !!previous?.completado && !previous?.reclamado
        const nowReady = !!item.completado && !item.reclamado
        const justClaimed = !!item.reclamado && !previous?.reclamado

        if (!wasReady && nowReady) {
          const key = `ach-ready-${item.id}`
          if (once(key)) {
            toast.success("¡Logro completado!", {
              description: item.titulo,
              duration: 5000,
              action: {
                label: "Ver",
                onClick: () => router.push("/milestones/logros"),
              },
            })
            fireConfetti("ready").catch(() => {})
          }
        }

        if (justClaimed) {
          const key = `ach-claimed-${item.id}`
          if (once(key)) {
            const pts = item.puntos ? ` +${item.puntos} PA` : ""
            toast("¡Recompensa reclamada!", {
              description: `${item.titulo}${pts}`,
              duration: 5000,
              action: {
                label: "Ver",
                onClick: () => router.push("/milestones/logros"),
              },
            })
            fireConfetti("claimed").catch(() => {})
          }
        }

        achievementsPrev.current.set(item.id, item)
      })
    }

    const fetchStates = async () => {
      try {
        const [weeklyRes, achRes] = await Promise.all([
          apiGet("/api/milestones/weekly-challenges"),
          apiGet("/api/milestones/achievements/all"),
        ])
        if (!mounted) return

        if (weeklyRes.ok) {
          const data = await weeklyRes.json()
          const challenges: WeeklyState[] = (data?.challenges ?? []).map((item: any) => ({
            id: item.id,
            titulo: item.titulo,
            puntos: Number(item.puntos ?? 0),
            completado: Boolean(item.completado),
            reclamado: Boolean(item.reclamado),
          }))
          processWeekly(challenges)
        }

        if (achRes.ok) {
          const data = await achRes.json()
          const achievements: AchievementState[] = (data?.achievements ?? []).map((item: any) => ({
            id: item.id,
            titulo: item.titulo,
            puntos: Number(item.puntos ?? 0),
            completado: Boolean(item.completado),
            reclamado: Boolean(item.reclamado),
          }))
          processAchievements(achievements)
        }
      } catch (error) {
        console.error("Error fetching achievement states:", error)
      }
    }

    fetchStates()
    const interval = setInterval(fetchStates, POLL_INTERVAL)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [router])

  return null
}
