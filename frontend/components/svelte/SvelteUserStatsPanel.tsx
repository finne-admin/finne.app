"use client"

import { useEffect, useRef } from "react"

type SvelteUserStatsPanelElement = HTMLElement & {
  name?: string
  email?: string
  summary?: string
  timeSummary?: string
  weeklyActiveDays?: string
  xpHistory?: string
  categoryDistribution?: string
  favoriteVideos?: string
  insights?: string
  xpTotal?: number
  xpLimit?: number
  xpOffset?: number
  xpFrom?: string
  xpTo?: string
}

interface SvelteUserStatsPanelProps {
  name: string
  email?: string
  summary: string
  timeSummary: string
  weeklyActiveDays: string
  xpHistory: string
  categoryDistribution: string
  favoriteVideos: string
  insights: string
  xpTotal: number
  xpLimit: number
  xpOffset: number
  xpFrom: string
  xpTo: string
  onXpFilter?: (range: { from: string; to: string }) => void
  onXpLoadMore?: (nextOffset: number) => void
  scriptReady?: boolean
}

export function SvelteUserStatsPanel({
  name,
  email,
  summary,
  timeSummary,
  weeklyActiveDays,
  xpHistory,
  categoryDistribution,
  favoriteVideos,
  insights,
  xpTotal,
  xpLimit,
  xpOffset,
  xpFrom,
  xpTo,
  onXpFilter,
  onXpLoadMore,
  scriptReady = true,
}: Readonly<SvelteUserStatsPanelProps>) {
  const panelRef = useRef<SvelteUserStatsPanelElement | null>(null)

  useEffect(() => {
    if (!scriptReady) return
    const el = panelRef.current
    if (!el) return
    el.name = name
    el.email = email ?? ""
    el.summary = summary
    el.timeSummary = timeSummary
    el.weeklyActiveDays = weeklyActiveDays
    el.xpHistory = xpHistory
    el.categoryDistribution = categoryDistribution
    el.favoriteVideos = favoriteVideos
    el.insights = insights
    el.xpTotal = xpTotal
    el.xpLimit = xpLimit
    el.xpOffset = xpOffset
    el.xpFrom = xpFrom
    el.xpTo = xpTo
  }, [
    name,
    email,
    summary,
    timeSummary,
    weeklyActiveDays,
    xpHistory,
    categoryDistribution,
    favoriteVideos,
    insights,
    xpTotal,
    xpLimit,
    xpOffset,
    xpFrom,
    xpTo,
    scriptReady,
  ])

  useEffect(() => {
    if (!scriptReady) return
    const el = panelRef.current
    if (!el) return

    const handleFilter = (event: Event) => {
      if (!onXpFilter) return
      const detail = (event as CustomEvent).detail || {}
      onXpFilter({
        from: typeof detail.from === "string" ? detail.from : "",
        to: typeof detail.to === "string" ? detail.to : "",
      })
    }

    const handleLoadMore = (event: Event) => {
      if (!onXpLoadMore) return
      const detail = (event as CustomEvent).detail || {}
      const nextOffset = Number(detail.nextOffset)
      if (Number.isFinite(nextOffset)) {
        onXpLoadMore(nextOffset)
      }
    }

    el.addEventListener("xpfilter", handleFilter)
    el.addEventListener("xploadmore", handleLoadMore)
    return () => {
      el.removeEventListener("xpfilter", handleFilter)
      el.removeEventListener("xploadmore", handleLoadMore)
    }
  }, [onXpFilter, onXpLoadMore, scriptReady])

  return <svelte-user-stats-panel ref={panelRef} />
}
