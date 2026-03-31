"use client"

import { useEffect, useMemo, useState } from "react"
import { apiGet, apiPost, apiPut } from "@/lib/apiClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CalendarClock, Loader2, Megaphone, Save } from "lucide-react"

type OrganizationOption = {
  id: string
  name: string
  slug: string
}

type AnnouncementRow = {
  id: string
  title: string | null
  message: string
  starts_at: string
  active: boolean
  organization_ids: string[]
  organization_names: string[]
}

export function GlobalAnnouncementsPanel() {
  const [organizations, setOrganizations] = useState<OrganizationOption[]>([])
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [startsAt, setStartsAt] = useState("")
  const [active, setActive] = useState(true)
  const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [status, setStatus] = useState("")

  const loadAnnouncements = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await apiGet("/api/admin/announcements")
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "No se pudieron cargar los avisos")
      setAnnouncements(Array.isArray(data?.announcements) ? data.announcements : [])
      setOrganizations(Array.isArray(data?.organizations) ? data.organizations : [])
    } catch (err) {
      console.error("Error cargando avisos:", err)
      setError(err instanceof Error ? err.message : "No se pudieron cargar los avisos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnnouncements().catch(() => {})
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setTitle("")
    setMessage("")
    setStartsAt("")
    setActive(true)
    setSelectedOrganizations([])
  }

  const handleEdit = (announcement: AnnouncementRow) => {
    setEditingId(announcement.id)
    setTitle(announcement.title ?? "")
    setMessage(announcement.message)
    setStartsAt(new Date(announcement.starts_at).toISOString().slice(0, 16))
    setActive(announcement.active)
    setSelectedOrganizations(announcement.organization_ids ?? [])
    setError("")
    setStatus("")
  }

  const toggleOrganization = (organizationId: string) => {
    setSelectedOrganizations((current) =>
      current.includes(organizationId)
        ? current.filter((id) => id !== organizationId)
        : [...current, organizationId]
    )
  }

  const handleSave = async () => {
    if (!message.trim()) {
      setError("El mensaje es obligatorio")
      return
    }
    if (!startsAt) {
      setError("Selecciona fecha y hora")
      return
    }
    if (!selectedOrganizations.length) {
      setError("Selecciona al menos una organización")
      return
    }

    setSaving(true)
    setError("")
    setStatus("")

    try {
      const payload = {
        id: editingId ?? undefined,
        title: title.trim() || null,
        message: message.trim(),
        starts_at: new Date(startsAt).toISOString(),
        active,
        organization_ids: selectedOrganizations,
      }

      const res = editingId
        ? await apiPut(`/api/admin/announcements/${editingId}`, payload)
        : await apiPost("/api/admin/announcements", payload)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "No se pudo guardar el aviso")

      setStatus(editingId ? "Aviso actualizado correctamente" : "Aviso creado correctamente")
      resetForm()
      await loadAnnouncements()
    } catch (err) {
      console.error("Error guardando aviso:", err)
      setError(err instanceof Error ? err.message : "No se pudo guardar el aviso")
    } finally {
      setSaving(false)
    }
  }

  const sortedAnnouncements = useMemo(
    () =>
      [...announcements].sort(
        (a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime()
      ),
    [announcements]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avisos programados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-gray-900">
            <Megaphone className="h-4 w-4 text-emerald-600" />
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Nuevo aviso
            </h3>
          </div>

          <div className="grid gap-4">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título opcional" />
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Texto del aviso"
              className="min-h-[140px]"
            />
            <div className="grid gap-4 md:grid-cols-[minmax(0,280px)_auto] md:items-end">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Mostrar a partir de
                </label>
                <div className="relative">
                  <CalendarClock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
                Activo
              </label>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Organizaciones destino
              </p>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {organizations.map((organization) => {
                  const checked = selectedOrganizations.includes(organization.id)
                  return (
                    <label
                      key={organization.id}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                        checked
                          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                          : "border-gray-200 bg-white text-gray-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOrganization(organization.id)}
                      />
                      <span className="flex-1">
                        {organization.name}
                        <span className="ml-2 text-xs text-gray-400">{organization.slug}</span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
            {status && <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{status}</div>}

            <div className="flex flex-wrap justify-end gap-3">
              {editingId && (
                <Button variant="outline" onClick={resetForm}>
                  Cancelar edición
                </Button>
              )}
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {editingId ? "Guardar cambios" : "Crear aviso"}
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Historial de avisos
          </h3>
          {loading ? (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando avisos...
            </div>
          ) : sortedAnnouncements.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
              No hay avisos creados todavía.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {sortedAnnouncements.map((announcement) => (
                <button
                  key={announcement.id}
                  type="button"
                  onClick={() => handleEdit(announcement)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/70 px-4 py-4 text-left transition hover:border-gray-300 hover:bg-white"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${announcement.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                      {announcement.active ? "Activo" : "Inactivo"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(announcement.starts_at).toLocaleString("es-ES", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-900">{announcement.title || "Aviso sin título"}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">{announcement.message}</p>
                  <p className="mt-2 text-xs text-gray-400">{announcement.organization_names.join(", ")}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
