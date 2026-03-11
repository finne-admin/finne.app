"use client"

import { useEffect, useMemo, useState } from "react"
import { apiGet, apiPut } from "@/lib/apiClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CheckCheck,
  Clock3,
  Loader2,
  MessageSquareWarning,
  RefreshCw,
  RotateCcw,
  Search,
  Undo2,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"

type ReportRow = {
  id: string
  user_id: string
  category: string
  message: string
  page_path: string | null
  user_agent: string | null
  status: "pending" | "resolved" | "dismissed"
  created_at: string
  resolved_at: string | null
  resolved_by: string | null
  resolved_by_email: string | null
  user_email: string | null
  user_name: string | null
  organization_name: string | null
  department_name: string | null
}

type ReportStatus = ReportRow["status"]

const formatDate = (value: string) =>
  new Date(value).toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  })

export function GlobalReportsPanel() {
  const [reports, setReports] = useState<ReportRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [status, setStatus] = useState("pending")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const normalizeStatus = (value: unknown): ReportStatus => {
    return value === "resolved" || value === "dismissed" || value === "pending"
      ? value
      : "pending"
  }

  const loadReports = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await apiGet("/api/admin/reports?limit=250")
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "No se pudieron cargar los reportes")
      }
      const normalizedReports = Array.isArray(data?.reports)
        ? data.reports.map((report: any) => ({
            ...report,
            status: normalizeStatus(report?.status),
          }))
        : []
      setReports(normalizedReports)
    } catch (err) {
      console.error("Error cargando reportes:", err)
      setReports([])
      setError(err instanceof Error ? err.message : "Error al cargar los reportes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports().catch(() => {})
  }, [])

  const categories = useMemo(
    () => Array.from(new Set(reports.map((report) => report.category).filter(Boolean))).sort(),
    [reports]
  )

  const filteredReports = useMemo(() => {
    const term = search.trim().toLowerCase()
    return reports.filter((report) => {
      const matchesCategory = category === "all" || report.category === category
      const matchesStatus = status === "all" || report.status === status
      if (!matchesCategory || !matchesStatus) return false
      if (!term) return true
      return [
        report.category,
        report.message,
        report.page_path,
        report.status,
        report.user_email,
        report.user_name,
        report.organization_name,
        report.department_name,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    })
  }, [category, reports, search, status])

  const handleStatusChange = async (reportId: string, nextStatus: ReportStatus) => {
    setUpdatingId(reportId)
    setError("")
    try {
      const res = await apiPut(`/api/admin/reports/${reportId}/status`, { status: nextStatus })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo actualizar el estado")
      }
      await loadReports()
    } catch (err) {
      console.error("Error actualizando estado del reporte:", err)
      setError(err instanceof Error ? err.message : "Error al actualizar el reporte")
    } finally {
      setUpdatingId(null)
    }
  }

  const statusMeta: Record<ReportStatus, { label: string; classes: string }> = {
    pending: {
      label: "Pendiente",
      classes: "bg-amber-50 text-amber-700",
    },
    resolved: {
      label: "Atendido",
      classes: "bg-emerald-50 text-emerald-700",
    },
    dismissed: {
      label: "Descartado",
      classes: "bg-slate-100 text-slate-700",
    },
  }

  const summary = useMemo(() => {
    return reports.reduce(
      (acc, report) => {
        acc.total += 1
        acc[report.status] += 1
        return acc
      },
      {
        total: 0,
        pending: 0,
        resolved: 0,
        dismissed: 0,
      }
    )
  }, [reports])

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Buzón de reports</CardTitle>
          <p className="text-sm text-gray-500">
            Incidencias enviadas desde el modal superior por los usuarios de la app.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={() => loadReports().catch(() => {})}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Recargar
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Pendientes</p>
            <p className="mt-2 text-3xl font-semibold text-amber-950">{summary.pending}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Atendidos</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-950">{summary.resolved}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Descartados</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.dismissed}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Total</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{summary.total}</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_220px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por mensaje, usuario, organización o ruta"
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="resolved">Atendidos</SelectItem>
              <SelectItem value="dismissed">Descartados</SelectItem>
              <SelectItem value="all">Todos los estados</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="ghost"
            className="justify-center border border-gray-200"
            onClick={() => {
              setSearch("")
              setCategory("all")
              setStatus("pending")
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Limpiar
          </Button>
        </div>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Cargando reportes...</span>
          </div>
        )}

        {!loading && filteredReports.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center">
            <MessageSquareWarning className="mx-auto mb-3 h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">No hay reports para mostrar</p>
            <p className="mt-1 text-sm text-gray-500">
              Ajusta los filtros o espera a que entren nuevos envíos.
            </p>
          </div>
        )}

        {!loading && filteredReports.length > 0 && (
          <div className="space-y-3">
            {filteredReports.map((report) => (
              (() => {
                const reportStatus = normalizeStatus(report.status)
                return (
              <article
                key={report.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-gray-300"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
                        {report.category}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusMeta[reportStatus].classes}`}
                      >
                        {statusMeta[reportStatus].label}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <Clock3 className="h-3.5 w-3.5" />
                        {formatDate(report.created_at)}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {report.user_name || report.user_email || report.user_id}
                      </p>
                      <p className="text-sm text-gray-500">{report.user_email || report.user_id}</p>
                      <p className="text-xs text-gray-400">
                        {[report.organization_name, report.department_name].filter(Boolean).join(" / ") || "Sin ubicación"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 px-4 py-3">
                      <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                        {report.message}
                      </p>
                    </div>

                    <div className="grid gap-3 text-sm text-gray-500 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                      <div className="rounded-xl border border-gray-100 bg-white px-3 py-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Ruta</p>
                        <p className="mt-1 break-words text-gray-600">{report.page_path || "Ruta no enviada"}</p>
                      </div>
                      <div className="rounded-xl border border-gray-100 bg-white px-3 py-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">User-Agent</p>
                        <p className="mt-1 break-words text-xs text-gray-500">
                          {report.user_agent || "User-Agent no disponible"}
                        </p>
                      </div>
                    </div>

                    {report.resolved_at && (
                      <p className="text-xs text-gray-400">
                        Gestionado el {formatDate(report.resolved_at)}
                        {report.resolved_by_email ? ` por ${report.resolved_by_email}` : ""}
                      </p>
                    )}
                  </div>

                  <div className="flex min-w-[220px] flex-col gap-2 lg:items-stretch">
                    {reportStatus !== "resolved" && (
                      <Button
                        type="button"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        disabled={updatingId === report.id}
                        onClick={() => handleStatusChange(report.id, "resolved")}
                      >
                        {updatingId === report.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCheck className="h-4 w-4" />
                        )}
                        <span className="ml-2">Marcar atendido</span>
                      </Button>
                    )}
                    {reportStatus !== "dismissed" && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={updatingId === report.id}
                        onClick={() => handleStatusChange(report.id, "dismissed")}
                      >
                        <XCircle className="h-4 w-4" />
                        <span className="ml-2">Descartar</span>
                      </Button>
                    )}
                    {reportStatus !== "pending" && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="border border-gray-200"
                        disabled={updatingId === report.id}
                        onClick={() => handleStatusChange(report.id, "pending")}
                      >
                        <Undo2 className="h-4 w-4" />
                        <span className="ml-2">Reabrir</span>
                      </Button>
                    )}
                  </div>
                </div>
              </article>
                )
              })()
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
