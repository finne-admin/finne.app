'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { openTallyPopup, tenantFromHost } from '@/lib/tally'

type AnswerMap = Record<string, boolean>
type DBForm = { id: string; title: string; active: boolean }

// Tipado mínimo para el objeto global de Tally
declare global {
  interface Window {
    Tally?: {
      openPopup: (
        formId: string,
        options?: {
          layout?: 'default' | 'modal'
          width?: number
          overlay?: boolean
          hiddenFields?: Record<string, any>
          onClose?: () => void
          onSubmit?: (payload: { id: string }) => void
        }
      ) => void
      closePopup: (formId: string) => void
    }
  }
}

export default function CuestionariosPage() {
  const supabase = useMemo(() => createClientComponentClient(), [])
  const [tallyReady, setTallyReady] = useState(false)

  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [userLoaded, setUserLoaded] = useState(false) // 👈 nuevo

  const [answered, setAnswered] = useState<AnswerMap>({})
  const [forms, setForms] = useState<DBForm[]>([])
  const currentOpenId = useRef<string | null>(null)

  const tenant = useMemo(
    () => (typeof window !== 'undefined' ? tenantFromHost(window.location.hostname) : 'piloto'),
    []
  )

  // 1) Cargar script Tally + escuchar cierre
  useEffect(() => {
    const src = 'https://tally.so/widgets/embed.js'
    const onLoad = () => setTallyReady(true)
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
    if (!existing) {
      const s = document.createElement('script')
      s.src = src
      s.async = true
      s.onload = onLoad
      s.onerror = onLoad
      document.body.appendChild(s)
    } else {
      onLoad()
    }
    const onPopupClosed = (e: MessageEvent) => {
      if (typeof e.data === 'string' && e.data.includes('Tally.PopupClosed')) {
        try {
          const payload = JSON.parse(e.data)
          if (payload?.payload?.formId && currentOpenId.current === payload.payload.formId) {
            currentOpenId.current = null
          }
        } catch { /* noop */ }
      }
    }
    window.addEventListener('message', onPopupClosed)
    return () => {
      window.removeEventListener('message', onPopupClosed)
      if (currentOpenId.current && window.Tally) {
        try { window.Tally.closePopup(currentOpenId.current) } catch {}
      }
    }
  }, [])

  // 2) Usuario + respuestas por tenant
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!mounted) return
      setUserId(user?.id ?? null)
      setEmail(user?.email ?? null)
      setUserLoaded(true) // ✅ ya sabemos si hay user

      if (!user) {
        setAnswered({})
        return
      }

      const { data, error } = await supabase
        .from('questionnaire_responses')
        .select('questionnaire_id, answered')
        .eq('user_id', user.id)
        .eq('tenant', tenant)
        .eq('answered', true)

      if (!mounted) return
      if (error) {
        console.error('Error fetching questionnaire_responses', error)
        return
      }
      const map: AnswerMap = {}
      data?.forEach(row => { map[row.questionnaire_id] = true })
      setAnswered(map)
    })()
    return () => { mounted = false }
  }, [supabase, tenant])

  // 3) Cuestionarios (con 'active')
  useEffect(() => {
    let mounted = true
    const fetchForms = async () => {
      const { data, error } = await supabase
        .from('questionnaires')
        .select('id, title, active')
        .order('created_at', { ascending: true })
      if (!mounted) return
      if (error) {
        console.error('Error fetching questionnaires', error)
        setForms([])
        return
      }
      setForms(data ?? [])
    }
    fetchForms()

    const ch = supabase
      .channel('questionnaires_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'questionnaires' }, fetchForms)
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(ch)
    }
  }, [supabase])

  // 4) Guardar respuesta (por tenant)
  const upsertAnswered = async (formId: string, submissionId?: string) => {
    if (!userId) return
    const { error } = await supabase
      .from('questionnaire_responses')
      .upsert(
        {
          tenant,
          questionnaire_id: formId,
          user_id: userId,
          answered: true,
          tally_submission_id: submissionId
        },
        { onConflict: 'tenant,questionnaire_id,user_id' }
      )
    if (error) {
      console.error('Error upserting questionnaire_responses', error)
    } else {
      setAnswered(prev => ({ ...prev, [formId]: true }))
    }
  }

  // 5) Abrir popup
  const openForm = async (formId: string) => {
    if (!window.Tally) return
    if (currentOpenId.current && currentOpenId.current !== formId) {
      try { window.Tally.closePopup(currentOpenId.current) } catch {}
    }

    // refresca sesión por si cambió
    const { data: { user } } = await supabase.auth.getUser()
    const uid = user?.id ?? userId
    const mail = user?.email ?? email

    if (!uid) {
      // aquí puedes lanzar un toast/modal
      console.warn('Necesitas iniciar sesión para abrir el cuestionario.')
      return
    }

    currentOpenId.current = formId
    openTallyPopup({
      formId,
      userId: uid,
      email: mail ?? null,
      onSubmit: (payloadId) => upsertAnswered(formId, payloadId)
    })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Cuestionarios</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Abre los formularios en un popup. Si un cuestionario está desactivado aparecerá en gris y no podrás abrirlo.
        </p>
      </header>

      {!userId && userLoaded && (
        <p className="text-sm text-orange-600 mb-4">
          Inicia sesión para registrar qué cuestionarios has contestado.
        </p>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Abrir en popup</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {forms.map((form) => {
            const isAnswered = !!answered[form.id]
            const isActive = !!form.active
            // 🔐 solo deshabilita cuando YA sabemos que no hay user
            const disabled = !tallyReady || !isActive || (userLoaded && !userId)

            const cardClasses = isAnswered
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-50'
              : isActive
                ? 'border-amber-200 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-50'
                : 'border-gray-200 bg-gray-100 text-gray-500 dark:bg-gray-900/40 dark:text-gray-300'

            const statusLabel = isAnswered ? 'Respondido' : isActive ? 'Pendiente' : 'Desactivado'
            const statusBorder =
              isAnswered ? 'border-emerald-300'
              : isActive ? 'border-amber-300'
              : 'border-gray-300'

            return (
              <button
                key={form.id}
                onClick={() => {
                  if (!userLoaded) return
                  if (!userId) return
                  if (isActive) openForm(form.id)
                }}
                disabled={disabled}
                aria-disabled={disabled}
                className={[
                  'rounded-2xl border px-4 py-3 text-left shadow-sm transition',
                  'hover:shadow',
                  disabled ? 'opacity-60 cursor-not-allowed' : '',
                  cardClasses,
                ].join(' ')}
                title={isActive ? `Abrir ${form.title}` : `${form.title} (desactivado)`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{form.title}</div>
                  <span className={`text-xs rounded-full px-2 py-0.5 border ${statusBorder}`}>
                    {statusLabel}
                  </span>
                </div>
                <div className="text-xs opacity-80 mt-1">
                  {isActive
                    ? (tallyReady ? 'Pulsa para abrir el cuestionario' : 'Cargando…')
                    : 'No disponible'}
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
