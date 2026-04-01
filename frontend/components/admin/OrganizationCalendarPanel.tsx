"use client"

import * as React from "react"
import { apiGet, apiPut } from "@/lib/apiClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { CalendarOff, Loader2, Plus, Save, Trash2 } from "lucide-react"

type OrganizationOption = {
  id: string
  name: string
  slug: string
  disable_saturdays: boolean
  disable_sundays: boolean
}

type BlackoutDateRow = {
  id?: string
  blocked_date: string
  reason: string | null
}

export function OrganizationCalendarPanel() {
  const [organizations, setOrganizations] = React.useState<OrganizationOption[]>([])
  const [selectedOrgId, setSelectedOrgId] = React.useState("")
  const [disableSaturdays, setDisableSaturdays] = React.useState(true)
  const [disableSundays, setDisableSundays] = React.useState(true)
  const [blackoutDates, setBlackoutDates] = React.useState<BlackoutDateRow[]>([])
  const [newDate, setNewDate] = React.useState("")
  const [newReason, setNewReason] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [loadingDetails, setLoadingDetails] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState("")
  const [status, setStatus] = React.useState("")

  const loadOrganizations = React.useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const res = await apiGet("/api/admin/calendar")
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "No se pudo cargar la configuracion")

      const list = Array.isArray(data?.organizations) ? data.organizations : []
      setOrganizations(list)
      if (list.length && !selectedOrgId) {
        setSelectedOrgId(list[0].id)
      }
    } catch (err) {
      console.error("Error cargando calendario de organizaciones:", err)
      setError(err instanceof Error ? err.message : "No se pudo cargar la configuracion")
    } finally {
      setLoading(false)
    }
  }, [selectedOrgId])

  React.useEffect(() => {
    loadOrganizations().catch(() => {})
  }, [loadOrganizations])

  const loadOrganizationCalendar = React.useCallback(async (organizationId: string) => {
    if (!organizationId) return

    setLoadingDetails(true)
    setError("")
    setStatus("")

    try {
      const res = await apiGet(`/api/admin/calendar/${organizationId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "No se pudo cargar el calendario")

      setDisableSaturdays(Boolean(data?.organization?.disable_saturdays))
      setDisableSundays(Boolean(data?.organization?.disable_sundays))
      setBlackoutDates(
        Array.isArray(data?.blackoutDates)
          ? data.blackoutDates.map((row: any) => ({
              id: row.id,
              blocked_date: row.blocked_date,
              reason: row.reason ?? null,
            }))
          : []
      )
    } catch (err) {
      console.error("Error cargando calendario de la organizacion:", err)
      setError(err instanceof Error ? err.message : "No se pudo cargar el calendario")
    } finally {
      setLoadingDetails(false)
    }
  }, [])

  React.useEffect(() => {
    loadOrganizationCalendar(selectedOrgId).catch(() => {})
  }, [selectedOrgId, loadOrganizationCalendar])

  const addBlackoutDate = () => {
    if (!newDate) {
      setError("Selecciona una fecha para añadirla")
      return
    }

    if (blackoutDates.some((row) => row.blocked_date === newDate)) {
      setError("Ese dia ya esta marcado")
      return
    }

    setError("")
    setBlackoutDates((current) =>
      [...current, { blocked_date: newDate, reason: newReason.trim() || null }].sort((a, b) =>
        a.blocked_date.localeCompare(b.blocked_date)
      )
    )
    setNewDate("")
    setNewReason("")
  }

  const removeBlackoutDate = (blockedDate: string) => {
    setBlackoutDates((current) => current.filter((row) => row.blocked_date !== blockedDate))
  }

  const handleSave = async () => {
    if (!selectedOrgId) return

    setSaving(true)
    setError("")
    setStatus("")

    try {
      const res = await apiPut(`/api/admin/calendar/${selectedOrgId}`, {
        disable_saturdays: disableSaturdays,
        disable_sundays: disableSundays,
        blackout_dates: blackoutDates.map((row) => ({
          blocked_date: row.blocked_date,
          reason: row.reason ?? null,
        })),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "No se pudo guardar la configuracion")

      setStatus("Calendario guardado correctamente")
      setOrganizations((current) =>
        current.map((organization) =>
          organization.id === selectedOrgId
            ? {
                ...organization,
                disable_saturdays: Boolean(data?.organization?.disable_saturdays),
                disable_sundays: Boolean(data?.organization?.disable_sundays),
              }
            : organization
        )
      )
      setBlackoutDates(
        Array.isArray(data?.blackoutDates)
          ? data.blackoutDates.map((row: any) => ({
              id: row.id,
              blocked_date: row.blocked_date,
              reason: row.reason ?? null,
            }))
          : []
      )
    } catch (err) {
      console.error("Error guardando calendario:", err)
      setError(err instanceof Error ? err.message : "No se pudo guardar la configuracion")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="space-y-1">
          <CardTitle>Días no laborables</CardTitle>
          <CardDescription>
            Define fines de semana y festivos en los que la organización no debe recibir pausas activas ni notificaciones.
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
          <p className="text-sm text-gray-500">Aún no hay organizaciones registradas.</p>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Organización</label>
              <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                <SelectTrigger className="w-full sm:w-[320px]">
                  <SelectValue placeholder="Selecciona una organización" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((organization) => (
                    <SelectItem key={organization.id} value={organization.id}>
                      {organization.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {loadingDetails ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando calendario...
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Bloquear sábados</p>
                        <p className="text-sm text-gray-500">
                          Si está activo, los sábados no habrá pausas ni notificaciones.
                        </p>
                      </div>
                      <Switch checked={disableSaturdays} onCheckedChange={setDisableSaturdays} />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Bloquear domingos</p>
                        <p className="text-sm text-gray-500">
                          Si está activo, los domingos no habrá pausas ni notificaciones.
                        </p>
                      </div>
                      <Switch checked={disableSundays} onCheckedChange={setDisableSundays} />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2 text-gray-900">
                    <CalendarOff className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                      Festivos y cierres puntuales
                    </h3>
                  </div>

                  <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)_auto] md:items-end">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                        Fecha
                      </label>
                      <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                        Motivo opcional
                      </label>
                      <Input
                        value={newReason}
                        onChange={(e) => setNewReason(e.target.value)}
                        placeholder="Festivo local, cierre de empresa..."
                      />
                    </div>

                    <Button type="button" variant="outline" onClick={addBlackoutDate}>
                      <Plus className="mr-2 h-4 w-4" />
                      Añadir día
                    </Button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {blackoutDates.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                        No hay días puntuales marcados para esta organización.
                      </div>
                    ) : (
                      blackoutDates.map((row) => (
                        <div
                          key={row.blocked_date}
                          className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50/70 px-4 py-4 md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{row.blocked_date}</p>
                            <p className="text-sm text-gray-500">
                              {row.reason || "Día no laborable sin motivo adicional"}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => removeBlackoutDate(row.blocked_date)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Quitar
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar calendario
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
