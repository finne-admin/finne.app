"use client"

import { useEffect, useRef, useState } from "react"

type SvelteRewardsPodiumElement = HTMLElement & {
  users?: unknown[]
  rewards?: Record<string, unknown>
  scopeLabel?: string
  loading?: boolean
}

interface SvelteRewardsPodiumProps {
  users: unknown[]
  rewards?: Record<string, unknown>
  scopeLabel?: string
  loading?: boolean
}

export function SvelteRewardsPodium({
  users,
  rewards,
  scopeLabel,
  loading = false,
}: Readonly<SvelteRewardsPodiumProps>) {
  const podiumRef = useRef<SvelteRewardsPodiumElement | null>(null)
  const [scriptReady, setScriptReady] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.customElements?.get("svelte-rewards-podium")) {
      setScriptReady(true)
      return
    }
    const script = document.createElement("script")
    script.type = "module"
    script.src = "/svelte/svelte-lab.js"
    script.onload = () => setScriptReady(true)
    script.onerror = () => setScriptReady(false)
    document.head.appendChild(script)
    return () => {
      script.remove()
    }
  }, [])

  useEffect(() => {
    if (!scriptReady) return
    const el = podiumRef.current
    if (!el) return
    el.users = users
    el.rewards = rewards ?? {}
    el.scopeLabel = scopeLabel ?? ""
    el.loading = loading
  }, [users, rewards, scopeLabel, loading, scriptReady])

  return <svelte-rewards-podium ref={podiumRef} />
}
