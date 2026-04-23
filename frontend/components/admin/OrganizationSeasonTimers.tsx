"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { apiGet, apiPut } from "@/lib/apiClient"

type OrganizationTimer = {
  id: string
  name: string
  slug: string
  season_deadline?: string | null
  season_timezone?: string | null
  season_anchor_date?: string | null
  season_interval_months?: number | null
}

const toDateInput = (value?: string | null) => {
  if (!value) return ""
  return value.slice(0, 10)
}

const INTERVAL_OPTIONS = [
  { value: "1", label: "1 mes" },
  { value: "2", label: "2 meses" },
  { value: "3", label: "3 meses" },
  { value: "6", label: "6 meses" },
  { value: "12", label: "12 meses" },
]

export function OrganizationSeasonTimers() {
  const [organizations, setOrganizations] = React.useState<OrganizationTimer[]>([])
  const [selectedOrgId, setSelectedOrgId] = React.useState<string>("")
  const [anchorDate, setAnchorDate] = React.useState<string>("")
  const [intervalMonths, setIntervalMonths] = React.useState<string>("1")
  const [timezone, setTimezone] = React.useState<string>("Europe/Madrid")
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState("")
  const [status, setStatus] = React.useState("")

  React.useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError("")
        const res = await apiGet("/api/admin/season-timers")
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || "Error al cargar temporizadores")
        }
        const list: OrganizationTimer[] = Array.isArray(data.organizations)
          ? data.organizations
          : []
        setOrganizations(list)
        if (list.length) {
          const first = list[0]
          setSelectedOrgId(first.id)
          setAnchorDate(toDateInput(first.season_anchor_date ?? first.season_deadline))
          setIntervalMonths(String(first.season_interval_months ?? 1))
          setTimezone(first.season_timezone || "Europe/Madrid")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error inesperado")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  React.useEffect(() => {
    const selected = organizations.find((org) => org.id === selectedOrgId)
    if (!selected) return
    setAnchorDate(toDateInput(selected.season_anchor_date ?? selected.season_deadline))
    setIntervalMonths(String(selected.season_interval_months ?? 1))
    setTimezone(selected.season_timezone || "Europe/Madrid")
  }, [organizations, selectedOrgId])

  const handleSave = async () => {
    if (!selectedOrgId) return
    if (!anchorDate) {
      setError("Debes indicar la fecha de inicio del ciclo")
      return
    }
    try {
      setSaving(true)
      setError("")
      setStatus("")
      const res = await apiPut(`/api/admin/season-timers/${selectedOrgId}`, {
        season_deadline: null,
        season_anchor_date: anchorDate,
        season_interval_months: Number(intervalMonths),
        season_timezone: timezone,
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "No se pudieron guardar los cambios")
      }
      const updated = data.organization
      setOrganizations((prev) =>
        prev.map((org) =>
          org.id === selectedOrgId
            ? {
                ...org,
                season_deadline: updated.season_deadline ?? updated.seasonDeadline ?? null,
                season_timezone: updated.season_timezone ?? updated.seasonTimezone ?? null,
                season_anchor_date: updated.season_anchor_date ?? updated.seasonAnchorDate ?? null,
                season_interval_months:
                  updated.season_interval_months ?? updated.seasonIntervalMonths ?? null,
              }
            : org
        )
      )
      setStatus("Temporizador actualizado correctamente")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar cambios")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="space-y-1">
          <CardTitle>Temporizadores de temporada</CardTitle>
          <CardDescription>
            Ajusta la fecha limite de temporada por organizacion para el ranking y la hucha.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {status && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
            {status}
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando organizaciones...
          </div>
        ) : organizations.length === 0 ? (
          <p className="text-sm text-gray-500">Aun no hay organizaciones registradas.</p>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Organizacion</label>
              <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                <SelectTrigger className="w-full sm:w-[320px]">
                  <SelectValue placeholder="Selecciona una organizacion" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedOrgId && (
              <div className="grid gap-4 lg:grid-cols-[200px_180px_minmax(0,1fr)] lg:items-end">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Inicio del ciclo</label>
                  <Input
                    type="date"
                    value={anchorDate}
                    onChange={(event) => setAnchorDate(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Intervalo</label>
                  <Select value={intervalMonths} onValueChange={setIntervalMonths}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un intervalo" />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERVAL_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    La temporada se reinicia automáticamente al completar este ciclo.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Zona horaria</label>
                  <Input
                    value={timezone}
                    onChange={(event) => setTimezone(event.target.value)}
                    placeholder="Europe/Madrid"
                  />
                  <p className="text-xs text-gray-500">
                    Usa un ID de zona horaria valido (ej: Europe/Madrid).
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-md border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-gray-600">
              Próximo corte calculado desde <span className="font-medium">{anchorDate || "la fecha seleccionada"}</span> cada{" "}
              <span className="font-medium">
                {INTERVAL_OPTIONS.find((option) => option.value === intervalMonths)?.label ?? `${intervalMonths} meses`}
              </span>.
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
