'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { openTallyPopup, tenantFromHost } from '@/lib/tally'
import { Sparkles } from 'lucide-react'

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

/* =========================
   Chip de XP reutilizable
   ========================= */
function XpChip({
  points,
  variant = 'default', // 'default' | 'muted'
}: {
  points: number
  variant?: 'default' | 'muted'
}) {
  const base =
    'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,.6)]'
  const tone =
    variant === 'muted'
      ? 'border border-gray-300 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300'
      : 'border border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200'
  return (
    <span className={`${base} ${tone}`}>
      <Sparkles className="h-4 w-4" />
      <span>+{points} AP</span>
    </span>
  )
}

/** 💡 Puntos por cuestionario: puedes personalizar por ID aquí.
 *  Si no está en el mapa, usará DEFAULT_POINTS. */
const DEFAULT_POINTS = 50
const QUESTIONNAIRE_POINTS: Record<string, number> = {
  // 'mV9BKy': 60, // <- ejemplo: cuestionario X da 60 XP
}
const getQuestionnairePoints = (formId: string) =>
  QUESTIONNAIRE_POINTS[formId] ?? DEFAULT_POINTS

export default function CuestionariosPage() {
  const supabase = useMemo(() => createClientComponentClient(), [])
  const [tallyReady, setTallyReady] = useState(false)

  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [userLoaded, setUserLoaded] = useState(false)

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
      setUserLoaded(true)

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

  /** 4) Guardar respuesta (por tenant) + otorgar XP si es primera vez */
  const awardExperienceForQuestionnaire = async (uid: string, formId: string, submissionId?: string) => {
    const points = getQuestionnairePoints(formId)
    try {
      // Reutilizamos la RPC de pausas para sumar XP genérica con meta
      const { error } = await supabase.rpc('add_pause_exp', {
        _user: uid,
        _points: points,
        _meta: {
          source: 'questionnaire',
          questionnaire_id: formId,
          tally_submission_id: submissionId ?? null,
          tenant
        }
      })
      if (error) throw error
    } catch (e) {
      console.error('Error otorgando XP por cuestionario:', e)
    }
  }

  const upsertAnswered = async (formId: string, submissionId?: string) => {
    if (!userId) return

    const already = !!answered[formId] // para evitar doble XP
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
      return
    }

    // marcar en UI
    setAnswered(prev => ({ ...prev, [formId]: true }))

    // si es la primera vez → sumar XP
    if (!already) {
      await awardExperienceForQuestionnaire(userId, formId, submissionId)
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

        {/* grid con más aire */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-5">
          {forms.map((form) => {
            const isAnswered = !!answered[form.id]
            const isActive = !!form.active
            // deshabilita cuando no hay Tally, está inactivo, no hay user (confirmado) o ya respondido
            const disabled = !tallyReady || !isActive || (userLoaded && !userId) || isAnswered

            const cardClasses = isAnswered
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-50'
              : isActive
                ? 'border-amber-200 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-50'
                : 'border-gray-200 bg-gray-100 text-gray-500 dark:bg-gray-900/40 dark:text-gray-300'

            const statusLabel = isAnswered ? 'Completado' : isActive ? 'Pendiente' : 'Desactivado'
            const statusBorder =
              isAnswered ? 'border-emerald-300'
              : isActive ? 'border-amber-300'
              : 'border-gray-300'

            const points = getQuestionnairePoints(form.id)

            return (
              <button
                key={form.id}
                onClick={() => {
                  if (!userLoaded) return
                  if (!userId) return
                  if (isActive && !isAnswered) openForm(form.id)
                }}
                disabled={disabled}
                aria-disabled={disabled}
                className={[
                  'group rounded-2xl border shadow-sm transition hover:shadow-md',
                  'px-5 py-4 sm:px-6 sm:py-5',
                  'min-h-[120px]', // altura mínima para que respire
                  disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
                  cardClasses,
                ].join(' ')}
                title={
                  isAnswered
                    ? `${form.title} (completado)`
                    : isActive ? `Abrir ${form.title}` : `${form.title} (desactivado)`
                }
              >
                {/* cabecera: título a la izquierda, chips a la derecha */}
                <div className="flex items-start justify-between gap-4">
                  {/* Título sin truncar; que envuelva líneas */}
                  <div className="flex-1">
                    <div className="font-semibold text-[15px] sm:text-base leading-snug text-foreground break-words">
                      {form.title}
                    </div>
                  </div>

                  {/* Columna de chips (no empuja el título) */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <XpChip points={points} variant={!isActive ? 'muted' : 'default'} />
                    <span
                      className={[
                        "text-xs rounded-full px-2 py-0.5 border bg-white/60 backdrop-blur-sm",
                        statusBorder
                      ].join(" ")}
                    >
                      {statusLabel}
                    </span>
                  </div>
                </div>

                {/* línea informativa inferior */}
                <div className="mt-2 text-xs opacity-80">
                  {isAnswered
                    ? 'AP otorgada'
                    : isActive
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
