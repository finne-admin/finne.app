// hooks/useUnclaimedProgressSplit.ts
'use client'
import { useEffect, useMemo, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type ChangePayload = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: any
  old: any
}

const isUnclaimed = (row: any) =>
  row?.completado === true && row?.reclamado === false

export function useUnclaimedProgressSplit() {
  const [weekly, setWeekly] = useState(0)
  const [ach, setAch] = useState(0)

  // ✅ un único cliente por instancia del hook (no recrear en cada render)
  const supabase = useMemo(() => createClientComponentClient(), [])

  useEffect(() => {
    let mounted = true
    let channel: ReturnType<typeof supabase.channel> | null = null

    const compute = async (uid: string) => {
      const [achQ, weekQ] = await Promise.all([
        supabase
          .from('user_achievements')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', uid).eq('completado', true).eq('reclamado', false),
        supabase
          .from('user_weekly_challenges')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', uid).eq('completado', true).eq('reclamado', false),
      ])
      if (!mounted) return
      setAch(achQ.count ?? 0)
      setWeekly(weekQ.count ?? 0)
    }

    const subscribe = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !mounted) return
      const uid = user.id

      await compute(uid)

      // 🔑 NOMBRE ÚNICO DE CANAL POR INSTANCIA
      const channelName = `unclaimed_split:${uid}:${Math.random().toString(36).slice(2)}`
      channel = supabase.channel(channelName)

      // -------- ACHIEVEMENTS --------
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_achievements', filter: `user_id=eq.${uid}` },
        (p: ChangePayload) => {
          if (!mounted) return
          if (p.eventType === 'INSERT' && p.new) {
            if (isUnclaimed(p.new)) setAch(c => c + 1)
            return
          }
          if (p.eventType === 'UPDATE' && p.old && p.new) {
            const was = isUnclaimed(p.old)
            const now = isUnclaimed(p.new)
            if (!was && now) setAch(c => c + 1)
            else if (was && !now) setAch(c => Math.max(0, c - 1))
            return
          }
          if (p.eventType === 'DELETE' && p.old) {
            if (isUnclaimed(p.old)) setAch(c => Math.max(0, c - 1))
            return
          }
          // Fallback por seguridad
          compute(uid)
        }
      )

      // -------- WEEKLY CHALLENGES --------
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_weekly_challenges', filter: `user_id=eq.${uid}` },
        (p: ChangePayload) => {
          if (!mounted) return
          if (p.eventType === 'INSERT' && p.new) {
            if (isUnclaimed(p.new)) setWeekly(c => c + 1)
            return
          }
          if (p.eventType === 'UPDATE' && p.old && p.new) {
            const was = isUnclaimed(p.old)
            const now = isUnclaimed(p.new)
            if (!was && now) setWeekly(c => c + 1)
            else if (was && !now) setWeekly(c => Math.max(0, c - 1))
            return
          }
          if (p.eventType === 'DELETE' && p.old) {
            if (isUnclaimed(p.old)) setWeekly(c => Math.max(0, c - 1))
            return
          }
          // Fallback por seguridad
          compute(uid)
        }
      )

      await channel.subscribe()

      // (Opcional) si se reconecta, recontar
      channel.on('system', { event: 'rejoined' }, () => { compute(uid) })
    }

    subscribe()

    return () => {
      mounted = false
      if (channel) {
        // ❗ Usa unsubscribe: NO uses removeChannel, o matarás el canal del otro componente
        channel.unsubscribe()
      }
    }
  }, [supabase])

  return {
    weeklyCount: weekly,
    achievementsCount: ach,
    hasWeekly: weekly > 0,
    hasAchievements: ach > 0,
  }
}
