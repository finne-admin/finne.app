"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, UploadIcon, Trash2 } from "lucide-react"
import { apiDelete, apiGet, apiPost } from "@/lib/apiClient"

type OrgStructure = {
  id: string
  name: string
  departments: { id: string; name: string }[]
}

type RewardDefinition = {
  id?: string
  position: number
  title: string
  description: string
  image_url?: string | null
  cta_url?: string | null
}

const POSITIONS = [
  { value: 1, label: "1º lugar" },
  { value: 2, label: "2º lugar" },
  { value: 3, label: "3º lugar" },
]

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

const defaultReward = (position: number): RewardDefinition => ({
  position,
  title: `Recompensa ${position}`,
  description: "",
  image_url: null,
  cta_url: "",
})

const tokenHeader = (): HeadersInit => {
  if (typeof window === "undefined") return {}
  const token = localStorage.getItem("accessToken")
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

export function RewardsManager() {
  const [orgs, setOrgs] = useState<OrgStructure[]>([])
  const [scopeType, setScopeType] = useState<"global" | "organization" | "department">("global")
  const [organizationId, setOrganizationId] = useState<string>("")
  const [departmentId, setDepartmentId] = useState<string>("")
  const [rewards, setRewards] = useState<Record<number, RewardDefinition>>({
    1: defaultReward(1),
    2: defaultReward(2),
    3: defaultReward(3),
  })
  const [loading, setLoading] = useState(true)
  const [savingPosition, setSavingPosition] = useState<number | null>(null)
  const [uploading, setUploading] = useState<number | null>(null)
  const [error, setError] = useState<string>("")
  const [status, setStatus] = useState<string>("")

  useEffect(() => {
    const loadOrgs = async () => {
      try {
        const res = await apiGet("/api/admin/org-structure")
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "No se pudo cargar la estructura")
        const list: OrgStructure[] = Array.isArray(data.organizations) ? data.organizations : []
        setOrgs(list)
        if (list.length) {
          setOrganizationId(list[0].id)
          if (list[0].departments.length) setDepartmentId(list[0].departments[0].id)
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadOrgs()
  }, [])

  const loadRewards = async () => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams()
      params.set("scopeType", scopeType)
      if (scopeType !== "global") {
        const scope = scopeType === "organization" ? organizationId : departmentId
        if (!scope) {
          setRewards({
            1: defaultReward(1),
            2: defaultReward(2),
            3: defaultReward(3),
          })
          setLoading(false)
          return
        }
        params.set("scopeId", scope)
      }
      const res = await apiGet(`/api/admin/rewards?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "No se pudieron cargar las recompensas")
      const rows: RewardDefinition[] = Array.isArray(data.rewards)
        ? data.rewards.map((row: any) => ({
            id: row.id,
            position: row.position,
            title: row.title,
            description: row.description || "",
            image_url: row.image_url,
            cta_url: row.cta_url || "",
          }))
        : []
      const nextState: Record<number, RewardDefinition> = {
        1: defaultReward(1),
        2: defaultReward(2),
        3: defaultReward(3),
      }
      rows.forEach((row) => {
        nextState[row.position] = { ...row }
      })
      setRewards(nextState)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (scopeType === "organization" && !organizationId && orgs.length) {
      setOrganizationId(orgs[0].id)
    }
    if (scopeType === "department") {
      const selectedOrg = orgs.find((org) => org.id === organizationId) || orgs[0]
      if (selectedOrg?.departments?.length && !departmentId) {
        setDepartmentId(selectedOrg.departments[0].id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeType, orgs])

  useEffect(() => {
    loadRewards()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeType, organizationId, departmentId])

  const handleFieldChange = (position: number, field: keyof RewardDefinition, value: string) => {
    setRewards((prev) => ({
      ...prev,
      [position]: { ...prev[position], [field]: value },
    }))
  }

  const handleSave = async (position: number) => {
    const scope = scopeType === "global" ? undefined : scopeType === "organization" ? organizationId : departmentId
    if (scopeType !== "global" && !scope) {
      setError("Selecciona una organización/departamento válido")
      return
    }
    try {
      setSavingPosition(position)
      setStatus("")
      setError("")
      const reward = rewards[position]
      const res = await apiPost("/api/admin/rewards", {
        scopeType,
        scopeId: scope,
        position,
        title: reward.title,
        description: reward.description,
        imageUrl: reward.image_url,
        ctaUrl: reward.cta_url,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "No se pudo guardar la recompensa")
      setStatus("Recompensa guardada correctamente")
      await loadRewards()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la recompensa")
    } finally {
      setSavingPosition(null)
    }
  }

  const handleDelete = async (position: number) => {
    const reward = rewards[position]
    if (!reward?.id) {
      setRewards((prev) => ({ ...prev, [position]: defaultReward(position) }))
      return
    }
    try {
      setSavingPosition(position)
      const res = await apiDelete(`/api/admin/rewards/${reward.id}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "No se pudo eliminar la recompensa")
      }
      setRewards((prev) => ({ ...prev, [position]: defaultReward(position) }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la recompensa")
    } finally {
      setSavingPosition(null)
    }
  }

  const uploadImage = async (position: number, file: File) => {
    if (!file) return
    setUploading(position)
    setError("")
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch(`${API_BASE_URL}/api/admin/rewards/upload`, {
        method: "POST",
        headers: tokenHeader(),
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "No se pudo subir la imagen")
      setRewards((prev) => ({
        ...prev,
        [position]: { ...prev[position], image_url: data.url },
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen")
    } finally {
      setUploading(null)
    }
  }

  const currentDepartments = useMemo(() => {
    const org = orgs.find((item) => item.id === organizationId)
    return org?.departments ?? []
  }, [orgs, organizationId])

  return (
    <Card className="border-emerald-100">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900">Recompensas del podio</CardTitle>
        <CardDescription>
          Define premios personalizados para cada nivel (global, organización o departamento). Si no configuras un nivel
          específico, se hereda del superior.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Select value={scopeType} onValueChange={(value) => setScopeType(value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Ámbito" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="organization">Organización</SelectItem>
              <SelectItem value="department">Departamento</SelectItem>
            </SelectContent>
          </Select>

          {scopeType !== "global" && (
            <Select value={organizationId} onValueChange={setOrganizationId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona organización" />
              </SelectTrigger>
              <SelectContent>
                {orgs.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {scopeType === "department" && (
            <Select value={departmentId} onValueChange={setDepartmentId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona departamento" />
              </SelectTrigger>
              <SelectContent>
                {currentDepartments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        {status && <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{status}</div>}

        {loading ? (
          <div className="py-8 text-center text-sm text-gray-500">Cargando recompensas...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {POSITIONS.map(({ value, label }) => {
              const reward = rewards[value]
              return (
                <div key={value} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(value)}
                      title="Eliminar personalización"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Título de la recompensa"
                    value={reward?.title ?? ""}
                    onChange={(e) => handleFieldChange(value, "title", e.target.value)}
                  />
                  <Textarea
                    placeholder="Descripción breve"
                    value={reward?.description ?? ""}
                    onChange={(e) => handleFieldChange(value, "description", e.target.value)}
                  />
                  <Input
                    placeholder="Enlace opcional"
                    value={reward?.cta_url ?? ""}
                    onChange={(e) => handleFieldChange(value, "cta_url", e.target.value)}
                  />
                  <div className="space-y-2">
                      {reward?.image_url ? (
                        <div className="rounded-xl border bg-gray-50 p-2">
                          <img
                            src={reward.image_url}
                            alt={`Imagen recompensa ${value}`}
                            className="h-32 w-full object-contain rounded-lg bg-white"
                          />
                        <Button
                          variant="secondary"
                          size="sm"
                          className="mt-2 w-full"
                          onClick={() => handleFieldChange(value, "image_url", "")}
                        >
                          Quitar imagen
                        </Button>
                      </div>
                    ) : (
                      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-6 text-sm text-gray-500 hover:bg-gray-50">
                        {uploading === value ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <UploadIcon className="h-5 w-5" />
                            <span>Subir imagen</span>
                          </>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) uploadImage(value, file)
                          }}
                        />
                      </label>
                    )}
                  </div>
                  <Button className="w-full" onClick={() => handleSave(value)} disabled={savingPosition === value}>
                    {savingPosition === value ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar recompensa"}
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
