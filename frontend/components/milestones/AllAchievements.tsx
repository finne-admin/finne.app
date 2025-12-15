'use client'

import { useCallback, useEffect, useMemo, useState } from "react"
import { AchievementCard, Logro } from "@/components/milestones/AchievementCard"
import { apiGet } from "@/lib/apiClient"
import { cn } from "@/lib/utils"

const ACHIEVEMENT_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "racha", label: "Racha" },
  { value: "pausas", label: "Pausas" },
  { value: "ejercicio", label: "Ejercicio" },
  { value: "ranking", label: "Ranking" },
  { value: "social", label: "Social" },
  { value: "interaccion", label: "Interacción" },
  { value: "otros", label: "Otros" },
]

const normalizeCategory = (value?: string | null) => value?.toLowerCase() ?? "otros"

export function TodosLosLogros() {
  const [logros, setLogros] = useState<Logro[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<string>("all")

  const fetchLogros = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiGet("/api/milestones/achievements/all")
      const data = await res.json()
      if (!res.ok) {
        console.error("Error al obtener catálogo de logros:", data)
        return
      }
      setLogros(Array.isArray(data.achievements) ? data.achievements : [])
    } catch (error) {
      console.error("Error al cargar logros:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLogros()
  }, [fetchLogros])

  const availableCategories = useMemo(() => {
    const unique = new Set<string>()
    for (const logro of logros) {
      unique.add(normalizeCategory(logro.category))
    }
    return unique
  }, [logros])

  const filteredLogros = useMemo(() => {
    if (selectedFilter === "all") return logros
    return logros.filter((logro) => normalizeCategory(logro.category) === selectedFilter)
  }, [logros, selectedFilter])

  if (loading && logros.length === 0) {
    return <p className="text-sm text-gray-500">Cargando logros...</p>
  }

  const grouped = filteredLogros.reduce<Map<string, Logro[]>>((map, logro) => {
    const key = logro.groupId || logro.id
    const arr = map.get(key) ?? []
    arr.push(logro)
    map.set(key, arr)
    return map
  }, new Map())

  const groupedList = Array.from(grouped.values()).map((levels) => {
    const ordered = [...levels].sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
    const nextPending = ordered.find((lvl) => !lvl.completado)
    const ratio =
      nextPending && nextPending.progresoTotal
        ? Math.max(0, Math.min(1, (nextPending.progresoActual ?? 0) / nextPending.progresoTotal))
        : 1
    const statusWeight = ordered.every((lvl) => lvl.reclamado)
      ? 2
      : ordered.some((lvl) => lvl.completado)
      ? 1
      : 0
    return {
      ordered,
      key: ordered[0]?.groupId || ordered[0]?.id,
      weight: statusWeight,
      ratio,
    }
  })

  const sortedGroups = groupedList.sort((a, b) => {
    if (a.weight !== b.weight) return a.weight - b.weight
    if (a.weight === 2 && b.weight === 2) {
      return (a.ordered[0]?.titulo || "").localeCompare(b.ordered[0]?.titulo || "")
    }
    return b.ratio - a.ratio
  })

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap gap-2">
        {ACHIEVEMENT_FILTERS.map((filter) => {
          const disabled = filter.value !== "all" && !availableCategories.has(filter.value)
          return (
            <button
              key={filter.value}
              type="button"
              disabled={disabled}
              className={cn(
                "px-3 py-1.5 rounded-full border text-sm transition-colors",
                selectedFilter === filter.value
                  ? "bg-emerald-500 text-white border-emerald-500 shadow"
                  : "bg-white text-slate-600 hover:bg-emerald-50 border-slate-200",
                disabled && "opacity-40 cursor-not-allowed"
              )}
              onClick={() => !disabled && setSelectedFilter(filter.value)}
            >
              {filter.label}
            </button>
          )
        })}
      </div>

      {sortedGroups.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No hay logros en esta categoría por el momento.
        </p>
      )}

      {sortedGroups.map(({ ordered, key }) => {
        const base = ordered[0]
        if (!base) return null
        return (
          <AchievementCard
            key={key}
            logro={base}
            levels={ordered}
          />
        )
      })}
    </div>
  )
}
