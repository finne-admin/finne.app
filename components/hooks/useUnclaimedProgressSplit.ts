// hooks/useUnclaimedProgressSplit.ts
'use client'
import { useEffect, useState } from 'react'
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

  useEffect(() => {
    const supabase = createClientComponentClient()
    let channel: ReturnType<typeof supabase.channel> | null = null
    let mounted = true

    const compute = async (uid: string) => {
      console.log('[compute] fetching totals for', uid)

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

      console.log('[compute] results', {
        ach: achQ.count,
        weekly: weekQ.count,
      })

      if (!mounted) return
      setAch(achQ.count ?? 0)
      setWeekly(weekQ.count ?? 0)
    }

    const subscribe = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !mounted) return
      const uid = user.id

      console.log('[subscribe] user id', uid)

      await compute(uid)

      channel = supabase
        .channel(`unclaimed_split:${uid}`)

        // -------- ACHIEVEMENTS --------
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'user_achievements', filter: `user_id=eq.${uid}` },
          (p: ChangePayload) => {
            console.log('[rt] ACH change', p)

            if (p.eventType === 'INSERT' && p.new) {
              if (isUnclaimed(p.new)) {
                console.log('[rt] setAch +1 (insert)')
                setAch(c => c + 1)
              } else {
                console.log('[rt] no change (insert not unclaimed)')
              }
              return
            }

            if (p.eventType === 'UPDATE') {
              if (p.old && p.new) {
                const was = isUnclaimed(p.old)
                const now = isUnclaimed(p.new)
                if (!was && now) {
                  console.log('[rt] setAch +1 (update transition -> unclaimed)')
                  setAch(c => c + 1)
                } else if (was && !now) {
                  console.log('[rt] setAch -1 (update transition -> claimed/off)')
                  setAch(c => Math.max(0, c - 1))
                } else {
                  console.log('[rt] no change in unclaimed status (ach)')
                }
              } else {
                console.log('[rt] fallback compute (ach, missing old/new)')
                compute(uid)
              }
              return
            }

            if (p.eventType === 'DELETE') {
              if (p.old && isUnclaimed(p.old)) {
                console.log('[rt] setAch -1 (delete)')
                setAch(c => Math.max(0, c - 1))
              } else {
                console.log('[rt] no change (delete not unclaimed)')
              }
              return
            }

            console.log('[rt] fallback compute (ach, unmatched case)')
            compute(uid)
          }
        )

        // -------- WEEKLY CHALLENGES --------
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'user_weekly_challenges', filter: `user_id=eq.${uid}` },
          (p: ChangePayload) => {
            console.log('[rt] WEEKLY change', p)

            if (p.eventType === 'INSERT' && p.new) {
              if (isUnclaimed(p.new)) {
                console.log('[rt] setWeekly +1 (insert)')
                setWeekly(c => c + 1)
              } else {
                console.log('[rt] no change (insert not unclaimed)')
              }
              return
            }

            if (p.eventType === 'UPDATE') {
              if (p.old && p.new) {
                const was = isUnclaimed(p.old)
                const now = isUnclaimed(p.new)
                if (!was && now) {
                  console.log('[rt] setWeekly +1 (update transition -> unclaimed)')
                  setWeekly(c => c + 1)
                } else if (was && !now) {
                  console.log('[rt] setWeekly -1 (update transition -> claimed/off)')
                  setWeekly(c => Math.max(0, c - 1))
                } else {
                  console.log('[rt] no change in unclaimed status (weekly)')
                }
              } else {
                console.log('[rt] fallback compute (weekly, missing old/new)')
                compute(uid)
              }
              return
            }

            if (p.eventType === 'DELETE') {
              if (p.old && isUnclaimed(p.old)) {
                console.log('[rt] setWeekly -1 (delete)')
                setWeekly(c => Math.max(0, c - 1))
              } else {
                console.log('[rt] no change (delete not unclaimed)')
              }
              return
            }

            console.log('[rt] fallback compute (weekly, unmatched case)')
            compute(uid)
          }
        )

        .subscribe()
    }

    subscribe()

    return () => {
      mounted = false
      if (channel) {
        console.log('[cleanup] removing channel')
        supabase.removeChannel(channel)
      }
    }
  }, [])

  console.log('[hook] render return', { weekly, ach })

  return {
    weeklyCount: weekly,
    achievementsCount: ach,
    hasWeekly: weekly > 0,
    hasAchievements: ach > 0,
  }
}
