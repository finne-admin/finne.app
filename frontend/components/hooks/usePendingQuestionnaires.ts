'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { tenantFromHost } from '@/lib/tally'

export function usePendingQuestionnaires() {
  const supabase = useMemo(() => createClientComponentClient(), [])
  const [pendingCount, setPendingCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // tenant del subdominio actual
  const tenant = useMemo(
    () => (typeof window !== 'undefined' ? tenantFromHost(window.location.hostname) : 'piloto'),
    []
  )

  useEffect(() => {
    let active = true

    async function fetchData() {
      setLoading(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!active) return

      if (!user) {
        setPendingCount(0)
        setLoading(false)
        return
      }

      // 1) IDs de cuestionarios activos
      const { data: forms, error: e1 } = await supabase
        .from('questionnaires')
        .select('id')
        .eq('active', true)

      if (!active) return
      if (e1 || !forms) {
        console.error('Error fetching questionnaires', e1)
        setPendingCount(0)
        setLoading(false)
        return
      }

      const ids = forms.map(f => f.id)
      if (ids.length === 0) {
        setPendingCount(0)
        setLoading(false)
        return
      }

      // 2) Respuestas del usuario en ESTE tenant, solo las true y de formularios activos
      const { data: responses, error: e2 } = await supabase
        .from('questionnaire_responses')
        .select('questionnaire_id')        // no necesitamos más columnas
        .eq('user_id', user.id)
        .eq('tenant', tenant)              // 👈 clave para multi-página
        .eq('answered', true)
        .in('questionnaire_id', ids)

      if (!active) return
      if (e2) {
        console.error('Error fetching questionnaire_responses', e2)
        setPendingCount(ids.length)        // fallback conservador
        setLoading(false)
        return
      }

      const answeredIds = new Set((responses ?? []).map(r => r.questionnaire_id))
      const pending = ids.filter(id => !answeredIds.has(id)).length

      setPendingCount(pending)
      setLoading(false)
    }

    fetchData()

    // Realtime: refresca cuando cambien respuestas o el catálogo
    const ch1 = supabase
      .channel('questionnaire_responses_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'questionnaire_responses' }, fetchData)
      .subscribe()

    const ch2 = supabase
      .channel('questionnaires_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'questionnaires' }, fetchData)
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(ch1)
      supabase.removeChannel(ch2)
    }
  }, [supabase, tenant])

  return { pendingCount, loading, hasPending: pendingCount > 0 }
}
