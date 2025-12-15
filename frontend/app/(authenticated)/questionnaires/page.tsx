"use client"

import { useEffect, useRef, useState } from "react"
import { openTallyPopup } from "@/lib/tally"
import { Sparkles } from "lucide-react"
import { apiGet, apiPost } from "@/lib/apiClient"

/* =========================
   Tipos
   ========================= */
type AnswerMap = Record<string, boolean>
type DBForm = { id: string; title: string; active: boolean }

declare global {
  interface Window {
    Tally?: {
      openPopup: (
        formId: string,
        options?: {
          layout?: "default" | "modal"
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
function XpChip({ points, variant = "default" }: { points: number; variant?: "default" | "muted" }) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,.6)]"
  const tone =
    variant === "muted"
      ? "border border-gray-300 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300"
      : "border border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200"
  return (
    <span className={`${base} ${tone}`}>
      <Sparkles className="h-4 w-4" />
      <span>+{points} AP</span>
    </span>
  )
}

const DEFAULT_POINTS = 50
const QUESTIONNAIRE_POINTS: Record<string, number> = {}
const getQuestionnairePoints = (formId: string) => QUESTIONNAIRE_POINTS[formId] ?? DEFAULT_POINTS

export default function CuestionariosPage() {
  const [tallyReady, setTallyReady] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [forms, setForms] = useState<DBForm[]>([])
  const [answered, setAnswered] = useState<AnswerMap>({})
  const [loading, setLoading] = useState(true)
  const currentOpenId = useRef<string | null>(null)

  /* =========================
     1️⃣ Cargar script de Tally
     ========================= */
  useEffect(() => {
    const src = "https://tally.so/widgets/embed.js"
    const onLoad = () => setTallyReady(true)
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
    if (!existing) {
      const s = document.createElement("script")
      s.src = src
      s.async = true
      s.onload = onLoad
      s.onerror = onLoad
      document.body.appendChild(s)
    } else {
      onLoad()
    }

    const onPopupClosed = (e: MessageEvent) => {
      if (typeof e.data === "string" && e.data.includes("Tally.PopupClosed")) {
        try {
          const payload = JSON.parse(e.data)
          if (payload?.payload?.formId && currentOpenId.current === payload.payload.formId) {
            currentOpenId.current = null
          }
        } catch {}
      }
    }

    window.addEventListener("message", onPopupClosed)
    return () => {
      window.removeEventListener("message", onPopupClosed)
      if (currentOpenId.current && window.Tally) {
        try {
          window.Tally.closePopup(currentOpenId.current)
        } catch {}
      }
    }
  }, [])

  /* =========================
     2️⃣ Obtener usuario con /me
     ========================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiGet("/api/auth/me")
        if (!res.ok) throw new Error("Usuario no autenticado")
        const data = await res.json()
        setUser(data.user)
      } catch {
        setUser(null)
      }
    }
    fetchUser()
  }, [])

  /* =========================
     3️⃣ Cargar formularios y respuestas
     ========================= */
  useEffect(() => {
    const fetchFormsAndResponses = async () => {
      try {
        setLoading(true)

        const [formsRes, responsesRes] = await Promise.all([
          apiGet("/api/questionnaires/list"),
          user ? apiGet(`/api/questionnaires/responses?user=${user.id}`) : Promise.resolve(null),
        ])

        if (formsRes.ok) {
          const formsData = await formsRes.json()
          setForms(formsData)
        }

        if (responsesRes && responsesRes.ok) {
          const responses = await responsesRes.json()
          const map: AnswerMap = {}
          responses.forEach((r: { questionnaire_id: string }) => {
            map[r.questionnaire_id] = true
          })
          setAnswered(map)
        }
      } catch (err) {
        console.error("Error cargando cuestionarios:", err)
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchFormsAndResponses()
  }, [user])

  /* =========================
     4️⃣ Guardar respuesta + XP
     ========================= */
  const handleSubmitResponse = async (form: DBForm, submissionId?: string) => {
    if (!user) return
    try {
      const formId = form.id
      await apiPost("/api/questionnaires/respond", {
        user_id: user.id,
        questionnaire_id: formId,
        answered: true,
        submission_id: submissionId,
      })

          // (por ahora answers en texto plano; puedes generar el string como quieras)
      const answersText = `Formulario ${formId} completado por ${user.email} (${user.id})`
      console.log("Guardando envío:", { formId, submissionId, user });
      await apiPost("/api/questionnaires/submit", {
        tally_submission_id: submissionId ?? null,
        form_id: formId,
        user_id: user.id,
        respondent_id: user.email, // puedes dejarlo null si no hace falta
        answers: answersText,
      })

      // Actualiza estado local
      setAnswered((prev) => ({ ...prev, [formId]: true }))

      // Otorga XP
      const points = getQuestionnairePoints(formId)
      await apiPost("/api/xp/add", {
        user_id: user.id,
        points,
        meta: {
          source: "questionnaire",
          questionnaire_id: formId,
          questionnaire_title: form.title,
          submission_id: submissionId ?? null,
        },
      })
    } catch (e) {
      console.error("Error guardando respuesta:", e)
    }
  }

  /* =========================
     5️⃣ Abrir popup Tally
     ========================= */
  const openForm = async (form: DBForm) => {
    if (!window.Tally) return
    if (!user) {
      console.warn("Usuario no autenticado.")
      return
    }

    if (currentOpenId.current && currentOpenId.current !== form.id) {
      try {
        window.Tally.closePopup(currentOpenId.current)
      } catch {}
    }

    currentOpenId.current = form.id
    openTallyPopup({
      formId: form.id,
      userId: user.id,
      email: user.email,
      onSubmit: (payloadId) => handleSubmitResponse(form, payloadId),
    })
  }

  /* =========================
     6️⃣ Renderizado
     ========================= */
  if (loading)
    return (
      <div className="text-center py-10 text-gray-500">
        Cargando cuestionarios...
      </div>
    )

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Cuestionarios</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Completa los formularios para ganar puntos. Los desactivados aparecerán en gris.
        </p>
      </header>

      {!user && (
        <p className="text-sm text-orange-600 mb-4">
          Inicia sesión para registrar tus cuestionarios.
        </p>
      )}

      <section className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-5">
          {forms.map((form) => {
            const isAnswered = !!answered[form.id]
            const isActive = !!form.active
            const disabled = !tallyReady || !isActive || !user || isAnswered
            const cardClasses = isAnswered
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : isActive
              ? "border-amber-200 bg-amber-50 text-amber-900"
              : "border-gray-200 bg-gray-100 text-gray-500"

            return (
              <button
                key={form.id}
                onClick={() => {
                  if (isActive && !isAnswered) openForm(form)
                }}
                disabled={disabled}
                className={`group rounded-2xl border shadow-sm transition hover:shadow-md px-5 py-4 sm:px-6 sm:py-5 min-h-[120px] ${
                  disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                } ${cardClasses}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 font-semibold text-[15px] sm:text-base leading-snug break-words">
                    {form.title}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <XpChip points={getQuestionnairePoints(form.id)} variant={!isActive ? "muted" : "default"} />
                    <span className="text-xs rounded-full px-2 py-0.5 border bg-white/60 backdrop-blur-sm">
                      {isAnswered ? "Completado" : isActive ? "Pendiente" : "Desactivado"}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-xs opacity-80">
                  {isAnswered
                    ? "AP otorgada"
                    : isActive
                    ? tallyReady
                      ? "Pulsa para abrir el cuestionario"
                      : "Cargando…"
                    : "No disponible"}
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
