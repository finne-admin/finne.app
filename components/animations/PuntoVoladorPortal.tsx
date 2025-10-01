'use client'

import { createPortal } from 'react-dom'
import { ReactNode, useEffect, useState } from 'react'

export function PuntoVoladorPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const el = document.getElementById('puntos-globales')
  if (!el) return null

  return createPortal(children, el)
}
