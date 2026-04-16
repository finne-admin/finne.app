"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

type TabItem = {
  label: string
  href: string
}

type SvelteMilestonesTabsElement = HTMLElement & {
  tabs?: TabItem[]
  activeHref?: string
}

interface SvelteMilestonesTabsProps {
  tabs: TabItem[]
}

export function SvelteMilestonesTabs({ tabs }: Readonly<SvelteMilestonesTabsProps>) {
  const tabsRef = useRef<SvelteMilestonesTabsElement | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const [scriptReady, setScriptReady] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.customElements?.get("svelte-milestones-tabs")) {
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
    const el = tabsRef.current
    if (!el) return

    el.tabs = tabs
    el.activeHref = pathname
  }, [tabs, pathname, scriptReady])

  useEffect(() => {
    if (!scriptReady) return
    const el = tabsRef.current
    if (!el) return

    const handleNavigate = (event: Event) => {
      const detail = (event as CustomEvent<{ href?: string }>).detail
      if (!detail?.href) return
      router.push(detail.href)
    }

    el.addEventListener("navigate", handleNavigate)
    return () => {
      el.removeEventListener("navigate", handleNavigate)
    }
  }, [router, scriptReady])

  return <svelte-milestones-tabs ref={tabsRef} />
}
