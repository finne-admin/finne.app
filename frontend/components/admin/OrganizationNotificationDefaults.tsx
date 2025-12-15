"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, X } from "lucide-react"
import { apiGet, apiPut } from "@/lib/apiClient"

interface OrganizationDefaults {
  id: string
  name: string
  slug: string
  times: string[]
  active: boolean
  allowWeekend: boolean
}

const MINUTES_GAP = 15
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/

const toMinutes = (value: string) => {
  const [h, m] = value.split(":").map(Number)
  return h * 60 + m
}

const hasRequiredGap = (times: string[], candidate: string) => {
  const candidateMinutes = toMinutes(candidate)
  return times.every((current) => Math.abs(toMinutes(current) - candidateMinutes) >= MINUTES_GAP)
}

const sortTimes = (times: string[]) =>
  [...times].sort((a, b) => toMinutes(a) - toMinutes(b))

export function OrganizationNotificationDefaults() {
  const [organizations, setOrganizations] = React.useState<OrganizationDefaults[]>([])
  const [selectedOrgId, setSelectedOrgId] = React.useState<string>("")
  const [formTimes, setFormTimes] = React.useState<string[]>([])
  const [formActive, setFormActive] = React.useState(true)
  const [formAllowWeekend, setFormAllowWeekend] = React.useState(true)
  const [newTime, setNewTime] = React.useState("09:00")
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState("")
  const [status, setStatus] = React.useState("")

  React.useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setLoading(true)
        setError("")
        const res = await apiGet("/api/admin/notification-defaults")
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || "Error al cargar horarios por defecto")
        }
        const normalized: OrganizationDefaults[] = Array.isArray(data.organizations)
          ? data.organizations.map((org: any) => ({
              id: org.id,
              name: org.name,
              slug: org.slug,
              times: sortTimes(Array.isArray(org.times) ? org.times : []),
              active: org.active ?? true,
              allowWeekend: org.allow_weekend_notifications ?? true,
            }))
          : []
        setOrganizations(normalized)
        if (normalized.length) {
          setSelectedOrgId(normalized[0].id)
          setFormTimes(normalized[0].times)
          setFormActive(normalized[0].active)
          setFormAllowWeekend(normalized[0].allowWeekend)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error inesperado")
      } finally {
        setLoading(false)
      }
    }

    loadOrganizations()
  }, [])

  React.useEffect(() => {
    const selected = organizations.find((org) => org.id === selectedOrgId)
    if (selected) {
      setFormTimes(selected.times)
      setFormActive(selected.active)
      setFormAllowWeekend(selected.allowWeekend)
    }
  }, [selectedOrgId, organizations])

  const handleAddTime = () => {
    if (!timeRegex.test(newTime)) {
      setError("El formato debe ser HH:MM")
      return
    }
    if (formTimes.includes(newTime)) {
      setError("El horario ya esta incluido")
      return
    }
    if (!hasRequiredGap(formTimes, newTime)) {
      setError("Los horarios deben estar separados al menos 15 minutos")
      return
    }
    setError("")
    setFormTimes((prev) => sortTimes([...prev, newTime]))
  }

  const handleRemoveTime = (time: string) => {
    setFormTimes((prev) => prev.filter((item) => item !== time))
  }

  const handleSave = async () => {
    if (!selectedOrgId) return
    if (!formTimes.length) {
      setError("La organizacion debe tener al menos un horario")
      return
    }
    try {
      setSaving(true)
      setError("")
      setStatus("")
      const res = await apiPut(`/api/admin/notification-defaults/${selectedOrgId}`, {
        times: formTimes,
        active: formActive,
        allow_weekend_notifications: formAllowWeekend,
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
                id: updated.id,
                name: updated.name,
                slug: updated.slug,
                times: sortTimes(Array.isArray(updated.times) ? updated.times : []),
                active: updated.active ?? true,
                allowWeekend: updated.allow_weekend_notifications ?? true,
              }
            : org
        )
      )
      setStatus("Cambios guardados correctamente")
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
          <CardTitle>Horarios por defecto</CardTitle>
          <CardDescription>
            Define los recordatorios iniciales que recibira cada empleado al registrarse en su organizacion.
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
              <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <Switch checked={formActive} onCheckedChange={setFormActive} />
                    <div>
                      <p className="font-medium text-sm text-gray-900">Recordatorios activos</p>
                      <p className="text-xs text-gray-500">
                        Si esta apagado, los nuevos usuarios comenzaran con las notificaciones en pausa.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Switch checked={formAllowWeekend} onCheckedChange={setFormAllowWeekend} />
                    <div>
                      <p className="font-medium text-sm text-gray-900">Permitir fines de semana</p>
                      <p className="text-xs text-gray-500">
                        Desactivalo si la organizacion solo quiere recordatorios de lunes a viernes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">Horarios por defecto</p>
                  {formTimes.length === 0 ? (
                    <p className="text-xs text-gray-500">Aun no hay horarios configurados.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formTimes.map((time) => (
                        <span
                          key={time}
                          className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-700"
                        >
                          {time}
                          <button
                            type="button"
                            className="text-emerald-700 hover:text-emerald-900"
                            onClick={() => handleRemoveTime(time)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nuevo horario</label>
                    <Input
                      type="time"
                      step={900}
                      value={newTime}
                      onChange={(event) => setNewTime(event.target.value)}
                    />
                  </div>
                  <Button type="button" variant="secondary" onClick={handleAddTime} className="sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Anadir horario
                  </Button>
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
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
