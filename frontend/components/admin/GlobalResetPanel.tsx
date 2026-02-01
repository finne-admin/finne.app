"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiGet, apiPost } from "@/lib/apiClient"

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

type ResetScope = "all" | "department"

const CONFIRM_TEXT = "REINICIAR"

type ResetResult = {
  affectedUsers: number
  achievementsDeleted: number
  weeklyDeleted: number
  activePausesDeleted: number
  satisfactionDeleted: number
  sessionParticipantsDeleted: number
  rankingUsersUpdated: number
}

export function GlobalResetPanel() {
  const [organizations, setOrganizations] = useState<OrgStructure[]>([])
  const [selectedOrg, setSelectedOrg] = useState("")
  const [scope, setScope] = useState<ResetScope>("all")
  const [selectedDept, setSelectedDept] = useState("")
  const [resetGeneralAchievements, setResetGeneralAchievements] = useState(false)
  const [resetWeeklyAchievements, setResetWeeklyAchievements] = useState(false)
  const [resetActivePauses, setResetActivePauses] = useState(false)
  const [resetRanking, setResetRanking] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [acknowledged, setAcknowledged] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [result, setResult] = useState<ResetResult | null>(null)

  const availableDepartments = useMemo(() => {
    return organizations.find((org) => org.id === selectedOrg)?.departments ?? []
  }, [organizations, selectedOrg])

  const hasSelectedParams =
    resetGeneralAchievements || resetWeeklyAchievements || resetActivePauses || resetRanking
  const requiresDept = scope === "department"
  const hasTarget = Boolean(selectedOrg) && (!requiresDept || Boolean(selectedDept))
  const confirmReady = confirmText.trim().toUpperCase() === CONFIRM_TEXT && acknowledged
  const canSubmit = hasTarget && hasSelectedParams && confirmReady

  useEffect(() => {
    let mounted = true

    const loadOrganizations = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await apiGet("/api/admin/org-structure")
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data?.error || "Error al obtener organizaciones")
        }
        const list = Array.isArray(data.organizations) ? data.organizations : []
        if (!mounted) return
        setOrganizations(list)
        if (list.length) {
          const firstDept = list[0].departments?.[0]?.id ?? ""
          setSelectedOrg((prev) => prev || list[0].id)
          setSelectedDept((prev) => prev || firstDept)
        }
      } catch (err) {
        console.error("Error loading org structure:", err)
        if (mounted) {
          setError(err instanceof Error ? err.message : "Error inesperado al cargar organizaciones")
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadOrganizations()
    return () => {
      mounted = false
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setSuccess("")
    setResult(null)

    if (!canSubmit) {
      setError("Completa la seleccion, parametros y confirmacion antes de continuar.")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        organizationId: selectedOrg,
        departmentId: scope === "department" ? selectedDept : null,
        resetGeneralAchievements,
        resetWeeklyAchievements,
        resetActivePauses,
        resetRanking,
      }

      const res = await apiPost("/api/admin/reset", payload)
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(data?.error || "No se pudo ejecutar el reinicio")
      }

      setResult(data?.result ?? null)
      setSuccess("Reinicio ejecutado correctamente.")
      setConfirmText("")
      setAcknowledged(false)
    } catch (err) {
      console.error("Error executing reset:", err)
      setError(err instanceof Error ? err.message : "Error inesperado al ejecutar el reinicio")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reinicio global</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-gray-600">
          Configura un reinicio por organizacion y alcance. El endpoint backend aun no esta
          conectado, pero la seleccion queda validada.
        </p>

        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label>Organizacion</Label>
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
            <Label>Alcance</Label>
            <Select
              value={scope}
              onValueChange={(value) => setScope(value as ResetScope)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el alcance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toda la organizacion</SelectItem>
                <SelectItem value="department">Departamento especifico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {scope === "department" && (
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
          )}

          <div className="space-y-3 lg:col-span-2">
            <Label>Parametros de reinicio</Label>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={resetGeneralAchievements}
                  onCheckedChange={(value) => setResetGeneralAchievements(Boolean(value))}
                />
                Logros generales cumplidos
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={resetWeeklyAchievements}
                  onCheckedChange={(value) => setResetWeeklyAchievements(Boolean(value))}
                />
                Logros semanales cumplidos
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={resetActivePauses}
                  onCheckedChange={(value) => setResetActivePauses(Boolean(value))}
                />
                Pausas activas realizadas
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={resetRanking}
                  onCheckedChange={(value) => setResetRanking(Boolean(value))}
                />
                Reiniciar ranking (exp periodica)
              </label>
            </div>
          </div>

          <div className="space-y-2 lg:col-span-2">
            <Label>Confirmacion</Label>
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <Input
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
                placeholder={`Escribe ${CONFIRM_TEXT} para habilitar`}
              />
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={acknowledged}
                  onCheckedChange={(value) => setAcknowledged(Boolean(value))}
                />
                Entiendo que esta accion es irreversible.
              </label>
            </div>
          </div>

          <div className="lg:col-span-2 flex items-center justify-between text-sm text-gray-500">
            {loading ? <span>Cargando organizaciones...</span> : <span />}
            <Button type="submit" disabled={!canSubmit || submitting}>
              {submitting ? "Ejecutando..." : "Ejecutar reinicio"}
            </Button>
          </div>
        </form>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
        {result && (
          <div className="text-sm text-gray-600 space-y-1">
            <p>Usuarios afectados: {result.affectedUsers}</p>
            {resetGeneralAchievements && (
              <p>Logros generales eliminados: {result.achievementsDeleted}</p>
            )}
            {resetWeeklyAchievements && (
              <p>Logros semanales eliminados: {result.weeklyDeleted}</p>
            )}
            {resetActivePauses && (
              <>
                <p>Pausas activas eliminadas: {result.activePausesDeleted}</p>
                <p>Valoraciones eliminadas: {result.satisfactionDeleted}</p>
              </>
            )}
            {resetRanking && (
              <p>Usuarios con ranking reiniciado: {result.rankingUsersUpdated}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
