"use client"

import { useEffect, useMemo, useState } from "react"
import { apiGet } from "@/lib/apiClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, MessageSquareWarning, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

type ReportRow = {
  id: string
  user_id: string
  category: string
  message: string
  page_path: string | null
  user_agent: string | null
  created_at: string
  user_email: string | null
  user_name: string | null
  organization_name: string | null
  department_name: string | null
}

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

  const loadReports = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await apiGet("/api/admin/reports?limit=250")
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "No se pudieron cargar los reportes")
      }
      setReports(Array.isArray(data?.reports) ? data.reports : [])
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
      if (!matchesCategory) return false
      if (!term) return true
      return [
        report.category,
        report.message,
        report.page_path,
        report.user_email,
        report.user_name,
        report.organization_name,
        report.department_name,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    })
  }, [category, reports, search])

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
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por mensaje, usuario, organización o ruta"
          />
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
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Mensaje</th>
                  <th className="px-4 py-3">Contexto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="align-top">
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                      {formatDate(report.created_at)}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">
                        {report.user_name || report.user_email || report.user_id}
                      </p>
                      <p className="text-gray-500">{report.user_email || report.user_id}</p>
                      <p className="text-gray-400">
                        {[report.organization_name, report.department_name].filter(Boolean).join(" / ") || "Sin ubicación"}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
                        {report.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      <p className="max-w-xl whitespace-pre-wrap break-words">{report.message}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      <p>{report.page_path || "Ruta no enviada"}</p>
                      <p className="mt-1 max-w-xs break-words text-xs text-gray-400">
                        {report.user_agent || "User-Agent no disponible"}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
