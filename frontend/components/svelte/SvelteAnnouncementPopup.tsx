"use client"

import { useEffect, useRef } from "react"

type SvelteAnnouncementPopupElement = HTMLElement & {
  open?: boolean
  title?: string
  message?: string
  cta?: string
}

type SvelteAnnouncementPopupProps = {
  open: boolean
  title?: string
  message?: string
  cta?: string
  onClose?: () => void
  scriptReady?: boolean
}

export function SvelteAnnouncementPopup({
  open,
  title,
  message,
  cta,
  onClose,
  scriptReady = true,
}: Readonly<SvelteAnnouncementPopupProps>) {
  const popupRef = useRef<SvelteAnnouncementPopupElement | null>(null)

  useEffect(() => {
    if (!scriptReady) return
    const el = popupRef.current
    if (!el) return
    el.open = open
    el.title = title ?? "Aviso"
    el.message = message ?? ""
    el.cta = cta ?? "Entendido"
  }, [open, title, message, cta, scriptReady])

  useEffect(() => {
    if (!scriptReady || !onClose) return
    const el = popupRef.current
    if (!el) return
    const handleDismiss = () => onClose()
    el.addEventListener("dismiss", handleDismiss)
    return () => {
      el.removeEventListener("dismiss", handleDismiss)
    }
  }, [onClose, scriptReady])

  return <svelte-announcement-popup ref={popupRef} />
}
