"use client"

import { useEffect, useMemo, useRef } from "react"

type Asset = {
  url: string
  width: number
  height: number
  type: string
}

type SvelteVideoCardElement = HTMLElement & {
  videoId?: string
  hashedId?: string
  title?: string
  description?: string
  duration?: string
  thumbnail?: string
  selected?: boolean
  disabled?: boolean
  badge?: string
  tags?: string[]
  favorite?: boolean
  categoryLeft?: string
  categoryRight?: string
  categoryLeftColor?: string
  categoryRightColor?: string
}

const getBestThumbnail = (assets: Asset[], targetWidth: number) => {
  const stillImages = assets.filter((asset) => asset.type === "StillImageFile")
  if (stillImages.length === 0) return null
  return stillImages.reduce((best, current) => {
    const currentDiff = Math.abs(current.width - targetWidth)
    const bestDiff = Math.abs(best.width - targetWidth)
    return currentDiff < bestDiff ? current : best
  }, stillImages[0])
}

const resolveCategoryColor = (label: string) => {
  const value = label.toLowerCase()
  if (value.includes("movilidad")) return "#7E2FF5  "
  if (value.includes("cervical")) return "#f59e0b"
  if (value.includes("core")) return "#DE87D5"
  if (value.includes("cardio")) return "#ef4444"
  if (value.includes("fuerza") && value.includes("superior")) return "#3b82f6"
  if (value.includes("fuerza") && value.includes("inferior")) return "#10b981"
  if (value.includes("miembro inferior")) return "#10b981"
  if (value.includes("miembro superior")) return "#3b82f6"
  return "#94a3b8"
}

const normalizeCategory = (label: string) => label.trim().toLowerCase()

const resolveCategoryPair = (tags: string[]) => {
  const unique = Array.from(new Set(tags.map(normalizeCategory))).filter(Boolean)
  const toLabel = (value: string) =>
    value.replace(/(^|\s)[a-záéíóúüñ]/g, (match) => match.toUpperCase())
  if (unique.length === 0) {
    return {
      left: "",
      right: "",
      leftColor: "#94a3b8",
      rightColor: "#94a3b8",
    }
  }
  const leftRaw = unique[0]
  const rightRaw = unique[1]
  const left = toLabel(leftRaw)
  const right = rightRaw ? toLabel(rightRaw) : ""
  return {
    left,
    right,
    leftColor: resolveCategoryColor(leftRaw),
    rightColor: resolveCategoryColor(rightRaw ?? leftRaw),
  }
}

interface SvelteVideoCardProps {
  id: string
  hashedId?: string
  title: string
  description: string
  duration: string
  assets: Asset[]
  isSelected: boolean
  onSelect: (id: string) => void
  disabled?: boolean
  badge?: string
  tags?: string[]
  isFavorite?: boolean
  onFavoriteToggle?: (hashedId: string) => void
  scriptReady?: boolean
}

export function SvelteVideoCard({
  id,
  hashedId,
  title,
  description,
  duration,
  assets,
  isSelected,
  onSelect,
  disabled = false,
  badge,
  tags = [],
  isFavorite,
  onFavoriteToggle,
  scriptReady = true,
}: Readonly<SvelteVideoCardProps>) {
  const cardRef = useRef<SvelteVideoCardElement | null>(null)
  const thumbnail = useMemo(() => getBestThumbnail(assets, 640), [assets])
  const categoryPair = useMemo(() => resolveCategoryPair(tags), [tags])

  useEffect(() => {
    if (!scriptReady) return
    const el = cardRef.current
    if (!el) return
    el.videoId = id
    el.hashedId = hashedId ?? ""
    el.title = title
    el.description = description
    el.duration = duration
    el.thumbnail = thumbnail?.url ?? ""
    el.selected = isSelected
    el.disabled = disabled
    el.badge = badge ?? ""
    el.tags = tags
    el.favorite = Boolean(isFavorite)
    el.categoryLeft = categoryPair.left
    el.categoryRight = categoryPair.right
    el.categoryLeftColor = categoryPair.leftColor
    el.categoryRightColor = categoryPair.rightColor
  }, [
    id,
    hashedId,
    title,
    description,
    duration,
    thumbnail,
    isSelected,
    disabled,
    badge,
    tags,
    isFavorite,
    categoryPair,
    scriptReady,
  ])

  useEffect(() => {
    if (!scriptReady) return
    const el = cardRef.current
    if (!el) return

    const handleSelect = (event: Event) => {
      const detail = (event as CustomEvent).detail
      onSelect(detail?.id ?? id)
    }

    const handleFavorite = (event: Event) => {
      if (!onFavoriteToggle) return
      const detail = (event as CustomEvent).detail
      const targetId = detail?.hashedId ?? hashedId
      if (targetId) {
        onFavoriteToggle(targetId)
      }
    }

    el.addEventListener("select", handleSelect)
    el.addEventListener("favorite", handleFavorite)
    return () => {
      el.removeEventListener("select", handleSelect)
      el.removeEventListener("favorite", handleFavorite)
    }
  }, [id, hashedId, onSelect, onFavoriteToggle, scriptReady])

  return <svelte-video-card ref={cardRef} />
}
