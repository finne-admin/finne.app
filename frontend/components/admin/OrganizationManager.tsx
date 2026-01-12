"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiGet, apiPost, apiPut } from "@/lib/apiClient"

type OrgStructure = {
  id: string
  name: string
  slug: string
  max_daily_active_pauses?: number | null
  departments: { id: string; name: string }[]
}

export function OrganizationManager() {
  const [organizations, setOrganizations] = useState<OrgStructure[]>([])
  const [selectedOrg, setSelectedOrg] = useState("")
  const [orgName, setOrgName] = useState("")
  const [orgSlug, setOrgSlug] = useState("")
  const [orgDailyLimit, setOrgDailyLimit] = useState("")
  const [deptName, setDeptName] = useState("")
  const [selectedOrgLimit, setSelectedOrgLimit] = useState("")
  const [loading, setLoading] = useState(true)
  const [savingOrg, setSavingOrg] = useState(false)
  const [savingDept, setSavingDept] = useState(false)
  const [savingLimit, setSavingLimit] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const loadStructure = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await apiGet("/api/admin/org-structure")
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Error al obtener organizaciones")
      }
      const list = Array.isArray(data.organizations) ? data.organizations : []
      setOrganizations(list)
      if (list.length && !selectedOrg) {
        setSelectedOrg(list[0].id)
        setSelectedOrgLimit(
          typeof list[0].max_daily_active_pauses === "number"
            ? String(list[0].max_daily_active_pauses)
            : ""
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar organizaciones")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStructure()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const org = organizations.find((item) => item.id === selectedOrg)
    if (!org) return
    setSelectedOrgLimit(
      typeof org.max_daily_active_pauses === "number"
        ? String(org.max_daily_active_pauses)
        : ""
    )
  }, [organizations, selectedOrg])

  const handleCreateOrganization = async (event: React.FormEvent) => {
    event.preventDefault()
    const name = orgName.trim()
    const slug = orgSlug.trim()
    if (!name) {
      setError("Debes ingresar el nombre de la organizacion")
      return
    }

    try {
      setSavingOrg(true)
      setError("")
      setSuccess("")
      const maxDailyActivePauses = orgDailyLimit.trim()
      const res = await apiPost("/api/admin/organizations", {
        name,
        slug: slug || undefined,
        maxDailyActivePauses: maxDailyActivePauses ? Number(maxDailyActivePauses) : undefined,
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "No se pudo crear la organizacion")
      }
      setOrgName("")
      setOrgSlug("")
      setOrgDailyLimit("")
      setSuccess("Organizacion creada correctamente")
      await loadStructure()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la organizacion")
    } finally {
      setSavingOrg(false)
    }
  }

  const handleCreateDepartment = async (event: React.FormEvent) => {
    event.preventDefault()
    const name = deptName.trim()
    if (!selectedOrg) {
      setError("Selecciona una organizacion")
      return
    }
    if (!name) {
      setError("Debes ingresar el nombre del departamento")
      return
    }

    try {
      setSavingDept(true)
      setError("")
      setSuccess("")
      const res = await apiPost("/api/admin/departments", {
        organizationId: selectedOrg,
        name,
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "No se pudo crear el departamento")
      }
      setDeptName("")
      setSuccess("Departamento creado correctamente")
      await loadStructure()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el departamento")
    } finally {
      setSavingDept(false)
    }
  }

  const handleUpdateDailyLimit = async (event: React.FormEvent) => {
    event.preventDefault()
    const limitValue = selectedOrgLimit.trim()
    if (!selectedOrg) {
      setError("Selecciona una organizacion")
      return
    }
    if (!limitValue) {
      setError("Debes ingresar el limite diario")
      return
    }

    try {
      setSavingLimit(true)
      setError("")
      setSuccess("")
      const res = await apiPut(`/api/admin/organizations/${selectedOrg}/daily-limit`, {
        maxDailyActivePauses: Number(limitValue),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "No se pudo actualizar el limite")
      }
      setSuccess("Limite diario actualizado")
      await loadStructure()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar el limite")
    } finally {
      setSavingLimit(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizaciones y departamentos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-emerald-600">{success}</p>}

        <form onSubmit={handleCreateOrganization} className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="orgName">Nombre de la organizacion</Label>
            <Input
              id="orgName"
              value={orgName}
              onChange={(event) => setOrgName(event.target.value)}
              placeholder="Finne Corp"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orgSlug">Slug (opcional)</Label>
            <Input
              id="orgSlug"
              value={orgSlug}
              onChange={(event) => setOrgSlug(event.target.value)}
              placeholder="finne-corp"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orgDailyLimit">Max pausas diarias (opcional)</Label>
            <Input
              id="orgDailyLimit"
              type="number"
              min={1}
              max={50}
              value={orgDailyLimit}
              onChange={(event) => setOrgDailyLimit(event.target.value)}
              placeholder="3"
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <Button type="submit" disabled={savingOrg}>
              {savingOrg ? "Creando..." : "Crear organizacion"}
            </Button>
          </div>
        </form>

        <form onSubmit={handleUpdateDailyLimit} className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Organizacion</Label>
            <Select value={selectedOrg} onValueChange={setSelectedOrg} disabled={loading}>
              <SelectTrigger>
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
          <div className="space-y-2">
            <Label htmlFor="selectedOrgLimit">Max pausas diarias</Label>
            <Input
              id="selectedOrgLimit"
              type="number"
              min={1}
              max={50}
              value={selectedOrgLimit}
              onChange={(event) => setSelectedOrgLimit(event.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={savingLimit || loading || !organizations.length}>
              {savingLimit ? "Guardando..." : "Guardar limite"}
            </Button>
          </div>
        </form>

        <form onSubmit={handleCreateDepartment} className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Organizacion</Label>
            <Select value={selectedOrg} onValueChange={setSelectedOrg} disabled={loading}>
              <SelectTrigger>
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
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="deptName">Nombre del departamento</Label>
            <Input
              id="deptName"
              value={deptName}
              onChange={(event) => setDeptName(event.target.value)}
              placeholder="Recursos Humanos"
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <Button type="submit" disabled={savingDept || loading || !organizations.length}>
              {savingDept ? "Creando..." : "Crear departamento"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
