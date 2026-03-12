"use client"

import { useEffect, useMemo, useState } from "react"
import { BellRing, CheckCheck, ChevronDown, Clock3, Inbox, Loader2, MessageSquareText } from "lucide-react"
import { apiGet, apiPut } from "@/lib/apiClient"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type UserReportStatus = "pending" | "resolved" | "dismissed"

type UserReport = {
  id: string
  category: string
  message: string
  page_path: string | null
  status: UserReportStatus
  created_at: string
  resolved_at: string | null
  admin_reply: string | null
  replied_at: string | null
  replied_by_email: string | null
  reply_read_at: string | null
}

const formatDate = (value: string) =>
  new Date(value).toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  })

const statusMeta: Record<UserReportStatus, { label: string; badge: string }> = {
  pending: { label: "Pendiente", badge: "bg-amber-50 text-amber-700" },
  resolved: { label: "Respondido", badge: "bg-emerald-50 text-emerald-700" },
  dismissed: { label: "Cerrado", badge: "bg-slate-100 text-slate-700" },
}

export function UserReportsInboxDialog({
  open,
  onOpenChange,
  onUnreadChange,
}: Readonly<{
  open: boolean
  onOpenChange: (next: boolean) => void
  onUnreadChange?: (count: number) => void
}>) {
  const [reports, setReports] = useState<UserReport[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [markingReadId, setMarkingReadId] = useState<string | null>(null)

  const loadReports = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await apiGet("/api/reports")
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "No se pudieron cargar tus reports")
      }
      setReports(Array.isArray(data?.reports) ? data.reports : [])
    } catch (err) {
      console.error("Error cargando inbox de reports:", err)
      setReports([])
      setError(err instanceof Error ? err.message : "Error al cargar tus reports")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open) return
    loadReports().catch(() => {})
  }, [open])

  const summary = useMemo(
    () =>
      reports.reduce(
        (acc, report) => {
          acc.total += 1
          if (report.admin_reply) acc.withReply += 1
          if (report.status === "pending") acc.pending += 1
          if (report.admin_reply && !report.reply_read_at) acc.unreadReplies += 1
          return acc
        },
        { total: 0, withReply: 0, pending: 0, unreadReplies: 0 }
      ),
    [reports]
  )

  useEffect(() => {
    onUnreadChange?.(summary.unreadReplies)
  }, [onUnreadChange, summary.unreadReplies])

  const pendingReports = useMemo(
    () =>
      reports.filter(
        (report) => report.status === "pending" || Boolean(report.admin_reply && !report.reply_read_at)
      ),
    [reports]
  )

  const closedReports = useMemo(
    () =>
      reports.filter(
        (report) => report.status !== "pending" && !(report.admin_reply && !report.reply_read_at)
      ),
    [reports]
  )

  const handleMarkAsRead = async (reportId: string) => {
    setMarkingReadId(reportId)
    setError("")
    try {
      const res = await apiPut(`/api/reports/${reportId}/read`, {})
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo confirmar la lectura")
      }
      await loadReports()
    } catch (err) {
      console.error("Error marcando respuesta como leida:", err)
      setError(err instanceof Error ? err.message : "Error al confirmar lectura")
    } finally {
      setMarkingReadId(null)
    }
  }

  const renderReportCard = (report: UserReport) => (
    <article key={report.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
            {report.category}
          </span>
          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusMeta[report.status].badge}`}>
            {statusMeta[report.status].label}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <Clock3 className="h-3.5 w-3.5" />
            {formatDate(report.created_at)}
          </span>
        </div>

        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
            {report.message}
          </p>
          {report.page_path && (
            <p className="mt-2 text-xs text-slate-400">Ruta: {report.page_path}</p>
          )}
        </div>

        {report.admin_reply ? (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                <CheckCheck className="h-4 w-4" />
                Respuesta del equipo
                {!report.reply_read_at && (
                  <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                    Nueva
                  </span>
                )}
              </div>
              {!report.reply_read_at && (
                <Button
                  type="button"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={markingReadId === report.id}
                  onClick={() => handleMarkAsRead(report.id)}
                >
                  {markingReadId === report.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCheck className="h-4 w-4" />
                  )}
                  <span className="ml-2">Marcar como leído</span>
                </Button>
              )}
            </div>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-emerald-950">
              {report.admin_reply}
            </p>
            <p className="mt-2 text-xs text-emerald-700/80">
              {report.replied_at ? formatDate(report.replied_at) : ""}
              {report.replied_by_email ? ` · ${report.replied_by_email}` : ""}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            {report.status === "pending"
              ? "Aún no hay respuesta. El equipo todavía no ha revisado este report."
              : "Este report se ha cerrado sin una respuesta escrita."}
          </div>
        )}
      </div>
    </article>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-4xl overflow-hidden border-none bg-white p-0 shadow-2xl">
        <div className="flex max-h-[88vh] flex-col overflow-hidden rounded-[28px]">
          <div className="border-b border-gray-100 bg-gradient-to-r from-[#f7fbfa] via-white to-[#fff7f7] px-6 py-5">
            <DialogHeader className="space-y-2">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                <Inbox className="h-3.5 w-3.5" />
                Buzón
              </div>
              <DialogTitle className="text-3xl font-semibold text-slate-950">Tus reports</DialogTitle>
              <DialogDescription className="text-base text-slate-500">
                Revisa el estado de tus incidencias y las respuestas del equipo cuando existan.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-5">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Pendientes</p>
                <p className="mt-2 text-3xl font-semibold text-amber-950">{summary.pending}</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Con respuesta</p>
                <p className="mt-2 text-3xl font-semibold text-emerald-950">{summary.withReply}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Total enviados</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.total}</p>
              </div>
            </div>

            {summary.unreadReplies > 0 && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                Tienes {summary.unreadReplies} respuesta{summary.unreadReplies === 1 ? "" : "s"} pendiente{summary.unreadReplies === 1 ? "" : "s"} de lectura.
              </div>
            )}

            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={() => loadReports().catch(() => {})}>
                <BellRing className="mr-2 h-4 w-4" />
                Recargar
              </Button>
            </div>

            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            {loading && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Cargando tus reports...</span>
              </div>
            )}

            {!loading && reports.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
                <MessageSquareText className="mx-auto mb-3 h-8 w-8 text-slate-400" />
                <p className="text-sm font-medium text-slate-700">Todavía no has enviado ningún report</p>
                <p className="mt-1 text-sm text-slate-500">
                  Cuando envíes uno desde el icono de incidencias, aparecerá aquí.
                </p>
              </div>
            )}

            {!loading && reports.length > 0 && (
              <div className="space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Pendientes
                    </h3>
                    <span className="text-xs text-slate-400">{pendingReports.length}</span>
                  </div>
                  {pendingReports.length > 0 ? (
                    pendingReports.map(renderReportCard)
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                      No tienes reports pendientes ahora mismo.
                    </div>
                  )}
                </div>

                {closedReports.length > 0 && (
                  <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between text-left"
                      onClick={() => setShowHistory((current) => !current)}
                    >
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Historial cerrado
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Reports respondidos o cerrados anteriormente.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>{closedReports.length}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${showHistory ? "rotate-180" : ""}`}
                        />
                      </div>
                    </button>

                    {showHistory && <div className="space-y-3">{closedReports.map(renderReportCard)}</div>}
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
