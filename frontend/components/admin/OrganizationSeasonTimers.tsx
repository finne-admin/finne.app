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
}

const toDateInput = (value?: string | null) => {
  if (!value) return ""
  return value.slice(0, 10)
}

export function OrganizationSeasonTimers() {
  const [organizations, setOrganizations] = React.useState<OrganizationTimer[]>([])
  const [selectedOrgId, setSelectedOrgId] = React.useState<string>("")
  const [deadline, setDeadline] = React.useState<string>("")
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
          setDeadline(toDateInput(first.season_deadline))
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
    setDeadline(toDateInput(selected.season_deadline))
    setTimezone(selected.season_timezone || "Europe/Madrid")
  }, [organizations, selectedOrgId])

  const handleSave = async () => {
    if (!selectedOrgId) return
    if (!deadline) {
      setError("Debes indicar una fecha limite de temporada")
      return
    }
    try {
      setSaving(true)
      setError("")
      setStatus("")
      const res = await apiPut(`/api/admin/season-timers/${selectedOrgId}`, {
        season_deadline: deadline,
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
              <div className="grid gap-4 sm:grid-cols-[200px_1fr] sm:items-end">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Fecha limite</label>
                  <Input
                    type="date"
                    value={deadline}
                    onChange={(event) => setDeadline(event.target.value)}
                  />
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
