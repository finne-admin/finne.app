'use client'

import { useEffect, useState } from 'react'

export function usePendingQuestionnaires(userId?: string) {
  const [pendingCount, setPendingCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    let active = true

    async function fetchPending() {
      setLoading(true)
      try {
        const res = await fetch(`/api/questionnaires/pending?user=${userId}`)
        const data = await res.json()

        if (active) setPendingCount(data.pendingCount ?? 0)
      } catch (err) {
        console.error('Error fetching pending questionnaires:', err)
        if (active) setPendingCount(0)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchPending()

    // 🔁 Actualiza cada 30s si quieres simular "realtime"
    const interval = setInterval(fetchPending, 30000)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [userId])

  return { pendingCount, loading, hasPending: pendingCount > 0 }
}
