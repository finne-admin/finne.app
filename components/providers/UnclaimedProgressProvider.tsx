// components/providers/UnclaimedProgressProvider.tsx
'use client'
import React, { createContext, useContext } from 'react'
import { useUnclaimedProgressSplit } from '@/components/hooks/useUnclaimedProgressSplit'

type Ctx = {
  hasWeekly: boolean
  hasAchievements: boolean
  weeklyCount: number
  achievementsCount: number
}

const UnclaimedCtx = createContext<Ctx | null>(null)

export function UnclaimedProgressProvider({ children }: { children: React.ReactNode }) {
  const value = useUnclaimedProgressSplit() // <-- UNA sola suscripción aquí
  return <UnclaimedCtx.Provider value={value}>{children}</UnclaimedCtx.Provider>
}

export function useUnclaimedProgress() {
  const ctx = useContext(UnclaimedCtx)
  if (!ctx) throw new Error('useUnclaimedProgress must be used within UnclaimedProgressProvider')
  return ctx
}
