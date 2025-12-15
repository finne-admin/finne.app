"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { apiDelete, apiGet, apiPost } from "@/lib/apiClient"

type JoinCode = {
  id: string
  code: string
  organization_name: string
  department_name: string
  auto_approve: boolean
  max_uses: number | null
  used_count: number
  expires_at: string | null
  created_at: string
}

type OrgStructure = {
  id: string
  name: string
  slug: string
  departments: {
    id: string
    name: string
    organization_id: string
  }[]
}

const formatDate = (value?: string | null) => {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export function JoinCodeManager() {
  const [codes, setCodes] = useState<JoinCode[]>([])
  const [organizations, setOrganizations] = useState<OrgStructure[]>([])
  const [selectedOrg, setSelectedOrg] = useState<string>("")
  const [selectedDept, setSelectedDept] = useState<string>("")
  const [autoApprove, setAutoApprove] = useState(false)
  const [maxUses, setMaxUses] = useState<string>("")
  const [expiresAt, setExpiresAt] = useState<string>("")
  const [customCode, setCustomCode] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const availableDepartments = useMemo(() => {
    return organizations.find((org) => org.id === selectedOrg)?.departments ?? []
  }, [organizations, selectedOrg])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [codesRes, orgRes] = await Promise.all([
        apiGet("/api/admin/join-codes"),
        apiGet("/api/admin/org-structure"),
      ])
      const codesData = await codesRes.json()
      const orgData = await orgRes.json()
      if (!codesRes.ok) {
        throw new Error(codesData.error || "Error al obtener códigos")
      }
      if (!orgRes.ok) {
        throw new Error(orgData.error || "Error al obtener organizaciones")
      }
      setCodes(Array.isArray(codesData.codes) ? codesData.codes : [])
      setOrganizations(Array.isArray(orgData.organizations) ? orgData.organizations : [])
      if (orgData.organizations?.length && !selectedOrg) {
        setSelectedOrg(orgData.organizations[0].id)
        setSelectedDept(orgData.organizations[0].departments?.[0]?.id ?? "")
      }
    } catch (err) {
      console.error("Error fetching join codes:", err)
      setError(err instanceof Error ? err.message : "Error inesperado al cargar códigos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedOrg || !selectedDept) {
      setError("Selecciona una organización y un departamento")
      return
    }

    setSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const payload: Record<string, unknown> = {
        organizationId: selectedOrg,
        departmentId: selectedDept,
        autoApprove,
      }

      if (maxUses) {
        const parsed = Number(maxUses)
        if (Number.isNaN(parsed) || parsed <= 0) {
          throw new Error("Límite de usos inválido")
        }
        payload.maxUses = parsed
      }

      if (expiresAt) {
        payload.expiresAt = new Date(expiresAt).toISOString()
      }

      if (customCode) {
        payload.code = customCode.trim().toUpperCase()
      }

      const res = await apiPost("/api/admin/join-codes", payload)
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "No se pudo crear el código")
      }

      setSuccess("Código creado correctamente")
      setCustomCode("")
      setMaxUses("")
      setExpiresAt("")
      await fetchData()
    } catch (err) {
      console.error("Error creating join code:", err)
      setError(err instanceof Error ? err.message : "Error inesperado al crear código")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar este código?")) return
    try {
      const res = await apiDelete(`/api/admin/join-codes/${id}`)
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "No se pudo eliminar el código")
      }
      await fetchData()
    } catch (err) {
      console.error("Error deleting join code:", err)
      setError(err instanceof Error ? err.message : "Error inesperado al eliminar código")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Códigos de registro</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Organización</Label>
            <Select
              value={selectedOrg}
              onValueChange={(value) => {
                setSelectedOrg(value)
                const firstDept =
                  organizations.find((org) => org.id === value)?.departments?.[0]?.id ?? ""
                setSelectedDept(firstDept)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una organización" />
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
            <Label>Departamento</Label>
            <Select value={selectedDept} onValueChange={setSelectedDept}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un departamento" />
              </SelectTrigger>
              <SelectContent>
                {availableDepartments.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">Sin departamentos</div>
                )}
                {availableDepartments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxUses">Límite de usos (opcional)</Label>
            <Input
              id="maxUses"
              type="number"
              min={1}
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expira (opcional)</Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customCode">Código personalizado (opcional)</Label>
            <Input
              id="customCode"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
              placeholder="ABC-DEF"
            />
          </div>

          <div className="space-y-2 flex items-center gap-3">
            <Switch id="autoApprove" checked={autoApprove} onCheckedChange={setAutoApprove} />
            <Label htmlFor="autoApprove" className="cursor-pointer">
              Activar cuentas automáticamente
            </Label>
          </div>

          <div className="md:col-span-2 flex items-center justify-end">
            <Button type="submit" disabled={submitting || !selectedOrg || !selectedDept}>
              {submitting ? "Creando..." : "Crear código"}
            </Button>
          </div>
        </form>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2 pr-4">Código</th>
                <th className="py-2 pr-4">Organización</th>
                <th className="py-2 pr-4">Departamento</th>
                <th className="py-2 pr-4">Auto</th>
                <th className="py-2 pr-4">Usos</th>
                <th className="py-2 pr-4">Expira</th>
                <th className="py-2 pr-4">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">
                    Cargando códigos...
                  </td>
                </tr>
              ) : codes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">
                    Aún no hay códigos creados.
                  </td>
                </tr>
              ) : (
                codes.map((code) => (
                  <tr key={code.id} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-mono text-sm">{code.code}</td>
                    <td className="py-3 pr-4">{code.organization_name}</td>
                    <td className="py-3 pr-4">{code.department_name}</td>
                    <td className="py-3 pr-4">{code.auto_approve ? "Sí" : "No"}</td>
                    <td className="py-3 pr-4">
                      {code.max_uses ? `${code.used_count}/${code.max_uses}` : `${code.used_count} / ∞`}
                    </td>
                    <td className="py-3 pr-4">{formatDate(code.expires_at)}</td>
                    <td className="py-3 pr-4">
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(code.id)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
