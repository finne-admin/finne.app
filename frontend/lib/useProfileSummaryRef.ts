// usePerfilResumenRef.ts
import { useRef } from 'react'

let perfilResumenRef: HTMLDivElement | null = null

export function setPerfilResumenRef(ref: HTMLDivElement | null) {
  perfilResumenRef = ref
}

export function getPerfilResumenRef(): HTMLDivElement | null {
  return perfilResumenRef
}
