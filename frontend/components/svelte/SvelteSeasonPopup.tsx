"use client"

import { useEffect, useRef } from "react"

type SvelteSeasonPopupElement = HTMLElement & {
  open?: boolean
  title?: string
  message?: string
  cta?: string
}

interface SvelteSeasonPopupProps {
  open: boolean
  title?: string
  message?: string
  cta?: string
  onClose?: () => void
  scriptReady?: boolean
}

export function SvelteSeasonPopup({
  open,
  title,
  message,
  cta,
  onClose,
  scriptReady = true,
}: Readonly<SvelteSeasonPopupProps>) {
  const popupRef = useRef<SvelteSeasonPopupElement | null>(null)

  useEffect(() => {
    if (!scriptReady) return
    const el = popupRef.current
    if (!el) return
    el.open = open
    el.title = title ?? "Temporada finalizada"
    el.message =
      message ??
      "La temporada actual ha terminado. Tus logros de temporada se reiniciaran para un nuevo ciclo."
    el.cta = cta ?? "Entendido"
  }, [open, title, message, cta, scriptReady])

  useEffect(() => {
    if (!scriptReady) return
    const el = popupRef.current
    if (!el || !onClose) return

    const handleDismiss = () => {
      onClose()
    }

    el.addEventListener("dismiss", handleDismiss)
    return () => {
      el.removeEventListener("dismiss", handleDismiss)
    }
  }, [onClose, scriptReady])

  return <svelte-season-popup ref={popupRef} />
}
