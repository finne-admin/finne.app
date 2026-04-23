"use client"

import { useEffect, useRef } from "react"

type SvelteErrorReportModalElement = HTMLElement & {
  open?: boolean
  categories?: string[]
  submitting?: boolean
  error?: string
  success?: boolean
  title?: string
  hint?: string
  canViewInbox?: boolean
  inboxLabel?: string
  attachmentName?: string
  attachmentUrl?: string
  attachmentUploading?: boolean
}

interface SvelteErrorReportModalProps {
  open: boolean
  categories: string[]
  submitting?: boolean
  error?: string
  success?: boolean
  title?: string
  hint?: string
  canViewInbox?: boolean
  inboxLabel?: string
  attachmentName?: string
  attachmentUrl?: string
  attachmentUploading?: boolean
  onClose?: () => void
  onSubmit?: (payload: { category: string; message: string }) => void
  onAttachmentChange?: (file: File | null) => void
  onInboxClick?: () => void
  scriptReady?: boolean
}

export function SvelteErrorReportModal({
  open,
  categories,
  submitting = false,
  error = "",
  success = false,
  title,
  hint,
  canViewInbox = false,
  inboxLabel = "Abrir buzón de reports",
  attachmentName,
  attachmentUrl,
  attachmentUploading = false,
  onClose,
  onSubmit,
  onAttachmentChange,
  onInboxClick,
  scriptReady = true,
}: Readonly<SvelteErrorReportModalProps>) {
  const modalRef = useRef<SvelteErrorReportModalElement | null>(null)

  useEffect(() => {
    if (!scriptReady) return
    const el = modalRef.current
    if (!el) return
    el.open = open
    el.categories = categories
    el.submitting = submitting
    el.error = error
    el.success = success
    el.title = title ?? "Reportar un problema"
    el.hint = hint ?? "Cuéntanos qué ha ocurrido para poder ayudarte."
    el.canViewInbox = canViewInbox
    el.inboxLabel = inboxLabel
    el.attachmentName = attachmentName ?? ""
    el.attachmentUrl = attachmentUrl ?? ""
    el.attachmentUploading = attachmentUploading
  }, [
    open,
    categories,
    submitting,
    error,
    success,
    title,
    hint,
    canViewInbox,
    inboxLabel,
    attachmentName,
    attachmentUrl,
    attachmentUploading,
    scriptReady,
  ])

  useEffect(() => {
    if (!scriptReady) return
    const el = modalRef.current
    if (!el) return

    const handleClose = () => onClose?.()
    const handleSubmit = (event: Event) => {
      if (!onSubmit) return
      const detail = (event as CustomEvent).detail || {}
      onSubmit({
        category: typeof detail.category === "string" ? detail.category : "",
        message: typeof detail.message === "string" ? detail.message : "",
      })
    }
    const handleInboxClick = () => onInboxClick?.()
    const handleAttachmentChange = (event: Event) => {
      const detail = (event as CustomEvent).detail || {}
      onAttachmentChange?.(detail.file instanceof File ? detail.file : null)
    }

    el.addEventListener("close", handleClose)
    el.addEventListener("submit", handleSubmit)
    el.addEventListener("inboxclick", handleInboxClick)
    el.addEventListener("attachmentchange", handleAttachmentChange)
    return () => {
      el.removeEventListener("close", handleClose)
      el.removeEventListener("submit", handleSubmit)
      el.removeEventListener("inboxclick", handleInboxClick)
      el.removeEventListener("attachmentchange", handleAttachmentChange)
    }
  }, [onClose, onSubmit, onAttachmentChange, onInboxClick, scriptReady])

  return <svelte-error-report-modal ref={modalRef} />
}
