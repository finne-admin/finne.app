'use client'
import { useEffect, useMemo, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type Opts = { type?: string } // si pasas type, cuenta solo ese tipo

export function useUnclaimedCount(opts: Opts = {}) {
  const [count, setCount] = useState(0)
  const sb = useMemo(() => createClientComponentClient(), [])

  // carga inicial
  useEffect(() => {
    let isMounted = true
    const load = async () => {
      const { data: { user } } = await sb.auth.getUser()
      if (!user) { isMounted && setCount(0); return }

      let q = sb.from('user_achievements')
        .select('id', { count: 'exact', head: true })
        .eq('reclamado', false)
        .eq('user_id', user.id)

      if (opts.type) q = q.eq('type', opts.type)

      const { count: c } = await q
      if (isMounted) setCount(c ?? 0)
    }
    load()
    return () => { isMounted = false }
  }, [sb, opts.type])

  // realtime: ante cualquier cambio relevante → refetch rápido
  useEffect(() => {
    let cancelled = false
    const subscribe = async () => {
      const { data: { user } } = await sb.auth.getUser()
      if (!user) return

      const channel = sb.channel('ua-unclaimed-mini')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'user_achievements',
          filter: `user_id=eq.${user.id}`
        }, async (payload) => {
          // Solo reaccionamos si afecta a "reclamado" o "type"
          const n = (payload.new ?? {}) as any
          const o = (payload.old ?? {}) as any
          const touches = (
            payload.eventType === 'INSERT' ||
            payload.eventType === 'DELETE' ||
            n.reclamado !== o.reclamado ||
            n.type !== o.type
          )
          if (!touches) return

          // Recontar (simple y robusto)
          let q = sb.from('user_achievements')
            .select('id', { count: 'exact', head: true })
            .eq('reclamado', false)
            .eq('user_id', user.id)
          if (opts.type) q = q.eq('type', opts.type)
          const { count: c } = await q
          if (!cancelled) setCount(c ?? 0)
        })
        .subscribe()

      return () => { sb.removeChannel(channel) }
    }
    const cleanupPromise = subscribe()
    return () => { cancelled = true; cleanupPromise.then(fn => fn && fn()) }
  }, [sb, opts.type])

  return count
}
