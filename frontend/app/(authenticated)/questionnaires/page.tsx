"use client"

import { useEffect, useRef, useState } from "react"
import { openTallyPopup } from "@/lib/tally"
import { Power, RotateCcw, Sparkles } from "lucide-react"
import { apiGet, apiPost, apiPut } from "@/lib/apiClient"

/* =========================
   Tipos
   ========================= */
type AnswerMap = Record<string, boolean>
type DBForm = { id: string; title: string; active: boolean }
type OrganizationOption = { id: string; name: string }

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
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [resettingId, setResettingId] = useState<string | null>(null)
  const [organizations, setOrganizations] = useState<OrganizationOption[]>([])
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>("all")
  const currentOpenId = useRef<string | null>(null)
  const isSuperAdmin =
    user?.roleName?.toLowerCase() === "superadmin" || user?.roleScope === "global"

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

  useEffect(() => {
    const fetchOrganizations = async () => {
      if (!isSuperAdmin) {
        setOrganizations([])
        setSelectedOrganizationId("all")
        return
      }

      try {
        const res = await apiGet("/api/admin/org-structure")
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data?.error || "No se pudieron cargar las organizaciones")
        }

        const list = Array.isArray(data?.organizations)
          ? data.organizations.map((organization: any) => ({
              id: organization.id,
              name: organization.name,
            }))
          : []

        setOrganizations(list)
      } catch (error) {
        console.error("Error cargando organizaciones:", error)
      }
    }

    fetchOrganizations()
  }, [isSuperAdmin])

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

  const toggleQuestionnaire = async (form: DBForm) => {
    if (!isSuperAdmin) return

    try {
      setTogglingId(form.id)
      const res = await apiPut(`/api/questionnaires/${form.id}/active`, {
        active: !form.active,
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo actualizar el cuestionario")
      }

      setForms((prev) =>
        prev.map((item) => (item.id === form.id ? { ...item, active: data.active } : item))
      )
    } catch (error) {
      console.error("Error actualizando cuestionario:", error)
    } finally {
      setTogglingId(null)
    }
  }

  const resetQuestionnaire = async (form: DBForm) => {
    if (!isSuperAdmin) return

    try {
      setResettingId(form.id)
      const res = await apiPut(`/api/questionnaires/${form.id}/reset`, {
        organizationId: selectedOrganizationId === "all" ? null : selectedOrganizationId,
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || "No se pudo reabrir el cuestionario")
      }

      const shouldResetLocalState =
        selectedOrganizationId === "all" ||
        (typeof user?.organizationId === "string" && user.organizationId === selectedOrganizationId)

      if (shouldResetLocalState) {
        setAnswered((prev) => {
          if (!prev[form.id]) return prev
          const next = { ...prev }
          delete next[form.id]
          return next
        })
      }
    } catch (error) {
      console.error("Error reabriendo cuestionario:", error)
    } finally {
      setResettingId(null)
    }
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

      {isSuperAdmin && (
        <section className="mb-6 flex flex-col gap-2 sm:max-w-sm">
          <label htmlFor="questionnaire-reset-organization" className="text-sm font-medium text-gray-700">
            Reapertura por organizacion
          </label>
          <select
            id="questionnaire-reset-organization"
            value={selectedOrganizationId}
            onChange={(event) => setSelectedOrganizationId(event.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-gray-400"
          >
            <option value="all">Todas las organizaciones</option>
            {organizations.map((organization) => (
              <option key={organization.id} value={organization.id}>
                {organization.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            El boton &quot;Permitir rehacer&quot; afectara solo a la organizacion seleccionada.
          </p>
        </section>
      )}

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
              <div
                key={form.id}
                role="button"
                tabIndex={disabled ? -1 : 0}
                onClick={() => {
                  if (!disabled) openForm(form)
                }}
                onKeyDown={(event) => {
                  if (disabled) return
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    openForm(form)
                  }
                }}
                aria-disabled={disabled}
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
                    {isSuperAdmin && (
                      <>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            toggleQuestionnaire(form)
                          }}
                          disabled={togglingId === form.id || resettingId === form.id}
                          className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white/80 px-2.5 py-1 text-[12px] font-medium text-gray-700 transition hover:border-gray-400 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Power className="h-3.5 w-3.5" />
                          {togglingId === form.id
                            ? "Guardando..."
                            : isActive
                            ? "Desactivar"
                            : "Activar"}
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            resetQuestionnaire(form)
                          }}
                          disabled={resettingId === form.id || togglingId === form.id}
                          className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white/80 px-2.5 py-1 text-[12px] font-medium text-gray-700 transition hover:border-gray-400 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          {resettingId === form.id ? "Reabriendo..." : "Permitir rehacer"}
                        </button>
                      </>
                    )}
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
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
