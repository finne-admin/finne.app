// components/notifications/AchievementsNotifier.tsx
'use client'

import { useEffect, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

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

type WeeklyRow = {
  user_id?: string
  challenge_id?: string
  completado?: boolean
  reclamado?: boolean
}

type AchievementRow = {
  user_id?: string
  achievement_id?: string
  completado?: boolean
  reclamado?: boolean
}

type Meta = { title: string; points?: number | null }

export default function AchievementsNotifier() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  // evita toasts duplicados por sesión
  const shown = useRef<Set<string>>(new Set())
  // cachés de metadatos
  const weeklyMeta = useRef<Map<string, Meta>>(new Map())
  const achMeta = useRef<Map<string, Meta>>(new Map())

  useEffect(() => {
    let mounted = true
    let chWeekly: ReturnType<typeof supabase.channel> | null = null
    let chAch: ReturnType<typeof supabase.channel> | null = null

    const once = (key: string) => {
      if (shown.current.has(key)) return false
      shown.current.add(key)
      return true
    }

    const getWeeklyMeta = async (id: string): Promise<Meta> => {
      const cached = weeklyMeta.current.get(id)
      if (cached) return cached
      const { data } = await supabase
        .from('weekly_challenges_catalog')
        .select('id,title,points')
        .eq('id', id)
        .maybeSingle()
      const meta: Meta = { title: data?.title ?? 'Reto semanal', points: data?.points ?? null }
      weeklyMeta.current.set(id, meta)
      return meta
    }

    const getAchMeta = async (id: string): Promise<Meta> => {
      const cached = achMeta.current.get(id)
      if (cached) return cached
      const { data } = await supabase
        .from('achievements_catalog')
        .select('id,title,points')
        .eq('id', id)
        .maybeSingle()
      const meta: Meta = { title: data?.title ?? 'Logro', points: data?.points ?? null }
      achMeta.current.set(id, meta)
      return meta
    }

    const start = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !mounted) return

      // WEEKLY
      chWeekly = supabase
        .channel(`notifier-weekly-${user.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'user_weekly_challenges', filter: `user_id=eq.${user.id}` },
          async (payload) => {
            if (!mounted) return
            const oldRow = (payload.old ?? {}) as WeeklyRow
            const newRow = (payload.new ?? {}) as WeeklyRow
            const cid = newRow.challenge_id || oldRow.challenge_id
            if (!cid) return

            const wasUnclaimed = !!oldRow.completado && !oldRow.reclamado
            const nowUnclaimed = !!newRow.completado && !newRow.reclamado
            const justClaimed = !!newRow.reclamado && !oldRow.reclamado

            // pasó a "listo para reclamar"
            if (!wasUnclaimed && nowUnclaimed) {
              const key = `weekly-ready-${cid}`
              if (!once(key)) return
              const meta = await getWeeklyMeta(cid)
              toast.success('¡Reto semanal completado!', {
                description: `${meta.title}`,
                duration: 5000,
                action: {
                  label: 'Ver',
                  onClick: () => router.push('/milestones'),
                },
              })
              fireConfetti('ready').catch(() => {})
            }

            // pasó a "reclamado"
            if (justClaimed) {
              const key = `weekly-claimed-${cid}`
              if (!once(key)) return
              const meta = await getWeeklyMeta(cid)
              const pts = meta.points ? ` +${meta.points} PA` : ''
              toast('¡Recompensa reclamada!', {
                description: `${meta.title}${pts}`,
                duration: 5000,
                action: {
                  label: 'Ver',
                  onClick: () => router.push('/milestones'),
                },
              })
              fireConfetti('claimed').catch(() => {})
            }
          }
        )
        .subscribe()

      // ACHIEVEMENTS
      chAch = supabase
        .channel(`notifier-ach-${user.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'user_achievements', filter: `user_id=eq.${user.id}` },
          async (payload) => {
            if (!mounted) return
            const oldRow = (payload.old ?? {}) as AchievementRow
            const newRow = (payload.new ?? {}) as AchievementRow
            const aid = (newRow.achievement_id || (payload.new as any)?.id || oldRow.achievement_id)
            if (!aid) return

            const wasUnclaimed = !!oldRow.completado && !oldRow.reclamado
            const nowUnclaimed = !!newRow.completado && !newRow.reclamado
            const justClaimed = !!newRow.reclamado && !oldRow.reclamado

            if (!wasUnclaimed && nowUnclaimed) {
              const key = `ach-ready-${aid}`
              if (!once(key)) return
              const meta = await getAchMeta(aid)
              toast.success('¡Logro completado!', {
                description: `${meta.title}`,
                duration: 5000,
                action: {
                  label: 'Ver',
                  onClick: () => router.push('/milestones/logros'),
                },
              })
              fireConfetti('ready').catch(() => {})
            }

            if (justClaimed) {
              const key = `ach-claimed-${aid}`
              if (!once(key)) return
              const meta = await getAchMeta(aid)
              const pts = meta.points ? ` +${meta.points} PA` : ''
              toast('¡Recompensa reclamada!', {
                description: `${meta.title}${pts}`,
                duration: 5000,
                action: {
                  label: 'Ver',
                  onClick: () => router.push('/milestones/logros'),
                },
              })
              fireConfetti('claimed').catch(() => {})
            }
          }
        )
        .subscribe()
    }

    start()

    return () => {
      mounted = false
      if (chWeekly) supabase.removeChannel(chWeekly)
      if (chAch) supabase.removeChannel(chAch)
    }
  }, [supabase, router])

  return null
}
