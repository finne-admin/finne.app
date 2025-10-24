'use client'

import { createContext, useContext, useRef, RefObject } from 'react'

const PerfilResumenRefContext = createContext<RefObject<HTMLDivElement> | null>(null)

export function PerfilResumenRefProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <PerfilResumenRefContext.Provider value={ref}>
      {children}
    </PerfilResumenRefContext.Provider>
  )
}

export function usePerfilResumenRef() {
  return useContext(PerfilResumenRefContext)
}
