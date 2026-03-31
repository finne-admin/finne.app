"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Trash2, UploadIcon } from "lucide-react"
import { apiGet, apiPost, apiPut } from "@/lib/apiClient"

type OrgStructure = {
  id: string
  name: string
  departments: { id: string; name: string }[]
}

type RewardKey = "guaranteed_winner" | "raffle_a" | "raffle_b"

type RewardDefinition = {
  id?: string
  reward_key: RewardKey
  title: string
  description: string
  image_url?: string | null
  cta_url?: string | null
}

type ThresholdRow = {
  id?: string
  min_points: number
  entries_count: number
  active: boolean
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

const rewardMeta: Array<{ key: RewardKey; label: string; hint: string }> = [
  {
    key: "guaranteed_winner",
    label: "Premio Top 1",
    hint: "Premio garantizado para la persona que quede en primera posición.",
  },
  {
    key: "raffle_a",
    label: "Premio Sorteo A",
    hint: "Primer premio sorteable entre quienes superen umbrales.",
  },
  {
    key: "raffle_b",
    label: "Premio Sorteo B",
    hint: "Segundo premio sorteable entre quienes superen umbrales.",
  },
]

const defaultReward = (rewardKey: RewardKey): RewardDefinition => ({
  reward_key: rewardKey,
  title:
    rewardKey === "guaranteed_winner"
      ? "Premio Top 1"
      : rewardKey === "raffle_a"
        ? "Premio Sorteo A"
        : "Premio Sorteo B",
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
  const [organizationId, setOrganizationId] = useState<string>("")
  const [rewards, setRewards] = useState<Record<RewardKey, RewardDefinition>>({
    guaranteed_winner: defaultReward("guaranteed_winner"),
    raffle_a: defaultReward("raffle_a"),
    raffle_b: defaultReward("raffle_b"),
  })
  const [thresholds, setThresholds] = useState<ThresholdRow[]>([])
  const [loading, setLoading] = useState(true)
  const [savingRewardKey, setSavingRewardKey] = useState<RewardKey | null>(null)
  const [savingThresholds, setSavingThresholds] = useState(false)
  const [uploading, setUploading] = useState<RewardKey | null>(null)
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
        }
      } catch (err) {
        console.error(err)
      }
    }

    loadOrgs()
  }, [])

  const loadConfig = async (targetOrganizationId: string) => {
    setLoading(true)
    setError("")
    try {
      const rewardsRes = await apiGet(`/api/admin/rewards?scopeType=organization&scopeId=${targetOrganizationId}`)
      const rewardsData = await rewardsRes.json()
      if (!rewardsRes.ok) throw new Error(rewardsData.error || "No se pudieron cargar los premios")

      const nextRewards: Record<RewardKey, RewardDefinition> = {
        guaranteed_winner: defaultReward("guaranteed_winner"),
        raffle_a: defaultReward("raffle_a"),
        raffle_b: defaultReward("raffle_b"),
      }

      const rows = Array.isArray(rewardsData.rewards) ? rewardsData.rewards : []
      rows.forEach((row: any) => {
        const key = row.reward_key as RewardKey
        if (!key || !nextRewards[key]) return
        nextRewards[key] = {
          id: row.id,
          reward_key: key,
          title: row.title,
          description: row.description || "",
          image_url: row.image_url,
          cta_url: row.cta_url || "",
        }
      })
      setRewards(nextRewards)

      const thresholdsRes = await apiGet(`/api/admin/rewards/thresholds/${targetOrganizationId}`)
      const thresholdsData = await thresholdsRes.json()
      if (!thresholdsRes.ok) throw new Error(thresholdsData.error || "No se pudieron cargar los umbrales")

      const nextThresholds: ThresholdRow[] = Array.isArray(thresholdsData.thresholds)
        ? thresholdsData.thresholds.map((row: any) => ({
            id: row.id,
            min_points: Number(row.min_points ?? 0),
            entries_count: Number(row.entries_count ?? 0),
            active: row.active !== false,
          }))
        : []

      setThresholds(nextThresholds)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!organizationId) return
    loadConfig(organizationId)
  }, [organizationId])

  const handleFieldChange = (rewardKey: RewardKey, field: keyof RewardDefinition, value: string) => {
    setRewards((prev) => ({
      ...prev,
      [rewardKey]: { ...prev[rewardKey], [field]: value },
    }))
  }

  const handleSaveReward = async (rewardKey: RewardKey) => {
    if (!organizationId) {
      setError("Selecciona una organización válida")
      return
    }

    try {
      setSavingRewardKey(rewardKey)
      setStatus("")
      setError("")
      const reward = rewards[rewardKey]
      const res = await apiPost("/api/admin/rewards", {
        scopeType: "organization",
        scopeId: organizationId,
        rewardKey,
        title: reward.title,
        description: reward.description,
        imageUrl: reward.image_url,
        ctaUrl: reward.cta_url,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "No se pudo guardar el premio")
      setStatus("Premio guardado correctamente")
      await loadConfig(organizationId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el premio")
    } finally {
      setSavingRewardKey(null)
    }
  }

  const uploadImage = async (rewardKey: RewardKey, file: File) => {
    if (!file) return
    setUploading(rewardKey)
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
        [rewardKey]: { ...prev[rewardKey], image_url: data.url },
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen")
    } finally {
      setUploading(null)
    }
  }

  const updateThreshold = (index: number, field: keyof ThresholdRow, value: number | boolean) => {
    setThresholds((prev) => prev.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)))
  }

  const addThreshold = () => {
    setThresholds((prev) => [
      ...prev,
      {
        min_points: prev.length ? prev[prev.length - 1].min_points + 1000 : 1000,
        entries_count: prev.length ? prev[prev.length - 1].entries_count + 1 : 1,
        active: true,
      },
    ])
  }

  const removeThreshold = (index: number) => {
    setThresholds((prev) => prev.filter((_, rowIndex) => rowIndex !== index))
  }

  const saveThresholds = async () => {
    if (!organizationId) {
      setError("Selecciona una organización válida")
      return
    }

    try {
      setSavingThresholds(true)
      setStatus("")
      setError("")

      const normalized = thresholds
        .map((row) => ({
          min_points: Number(row.min_points),
          entries_count: Number(row.entries_count),
          active: row.active !== false,
        }))
        .sort((a, b) => a.min_points - b.min_points)

      const res = await apiPut(`/api/admin/rewards/thresholds/${organizationId}`, {
        thresholds: normalized,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "No se pudieron guardar los umbrales")

      setStatus("Umbrales guardados correctamente")
      await loadConfig(organizationId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron guardar los umbrales")
    } finally {
      setSavingThresholds(false)
    }
  }

  const sortedThresholds = useMemo(
    () => [...thresholds].sort((a, b) => a.min_points - b.min_points),
    [thresholds]
  )

  return (
    <Card className="border-emerald-100">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900">Premios y sorteo por puntos</CardTitle>
        <CardDescription>
          Configura el premio garantizado del Top 1, los dos premios sorteables y los umbrales de participaciones por organización.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="max-w-sm">
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
        </div>

        {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        {status && <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{status}</div>}

        {loading ? (
          <div className="py-8 text-center text-sm text-gray-500">Cargando configuración...</div>
        ) : (
          <>
            <div className="grid gap-6 xl:grid-cols-3">
              {rewardMeta.map(({ key, label, hint }) => {
                const reward = rewards[key]
                return (
                  <div key={key} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
                      <p className="text-sm text-gray-500">{hint}</p>
                    </div>
                    <Input
                      placeholder="Título del premio"
                      value={reward?.title ?? ""}
                      onChange={(e) => handleFieldChange(key, "title", e.target.value)}
                    />
                    <Textarea
                      placeholder="Descripción breve"
                      value={reward?.description ?? ""}
                      onChange={(e) => handleFieldChange(key, "description", e.target.value)}
                    />
                    <Input
                      placeholder="Enlace opcional"
                      value={reward?.cta_url ?? ""}
                      onChange={(e) => handleFieldChange(key, "cta_url", e.target.value)}
                    />
                    <div className="space-y-2">
                      {reward?.image_url ? (
                        <div className="rounded-xl border bg-gray-50 p-2">
                          <img
                            src={reward.image_url}
                            alt={`Imagen ${label}`}
                            className="h-32 w-full rounded-lg bg-white object-contain"
                          />
                          <Button
                            variant="secondary"
                            size="sm"
                            className="mt-2 w-full"
                            onClick={() => handleFieldChange(key, "image_url", "")}
                          >
                            Quitar imagen
                          </Button>
                        </div>
                      ) : (
                        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-6 text-sm text-gray-500 hover:bg-gray-50">
                          {uploading === key ? (
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
                              if (file) uploadImage(key, file)
                            }}
                          />
                        </label>
                      )}
                    </div>
                    <Button className="w-full" onClick={() => handleSaveReward(key)} disabled={savingRewardKey === key}>
                      {savingRewardKey === key ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar premio"}
                    </Button>
                  </div>
                )
              })}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Umbrales de participaciones</h3>
                  <p className="text-sm text-gray-500">
                    El usuario obtiene las participaciones del umbral más alto que haya alcanzado.
                  </p>
                </div>
                <Button variant="secondary" onClick={addThreshold}>
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir umbral
                </Button>
              </div>

              <div className="space-y-3">
                {sortedThresholds.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                    No hay umbrales configurados todavía.
                  </div>
                ) : (
                  sortedThresholds.map((threshold, index) => (
                    <div key={threshold.id ?? `${threshold.min_points}-${index}`} className="grid gap-3 rounded-xl border border-gray-200 p-3 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                          Puntos mínimos
                        </label>
                        <Input
                          type="number"
                          min={1}
                          value={threshold.min_points}
                          onChange={(e) => updateThreshold(index, "min_points", Number(e.target.value))}
                          placeholder="Ej. 1000"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                          Participaciones
                        </label>
                        <Input
                          type="number"
                          min={1}
                          value={threshold.entries_count}
                          onChange={(e) => updateThreshold(index, "entries_count", Number(e.target.value))}
                          placeholder="Ej. 1"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={threshold.active}
                          onChange={(e) => updateThreshold(index, "active", e.target.checked)}
                        />
                        Activo
                      </label>
                      <Button variant="ghost" size="icon" onClick={() => removeThreshold(index)} title="Eliminar umbral">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="md:col-span-4 rounded-xl bg-emerald-50/60 px-3 py-2 text-xs text-emerald-800">
                        Desde <strong>{Number(threshold.min_points || 0).toLocaleString("es-ES")} PA</strong> el usuario obtiene{" "}
                        <strong>{Number(threshold.entries_count || 0).toLocaleString("es-ES")}</strong>{" "}
                        participac{Number(threshold.entries_count || 0) === 1 ? "ión" : "iones"}.
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={saveThresholds} disabled={savingThresholds}>
                  {savingThresholds ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar umbrales"}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
