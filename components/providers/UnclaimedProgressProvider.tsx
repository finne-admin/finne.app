// components/providers/UnclaimedProgressProvider.tsx
'use client'
import React, { createContext, useContext, useMemo } from 'react'
import { useUnclaimedProgressSplit } from '@/components/hooks/useUnclaimedProgressSplit'

type Ctx = {
  hasWeekly: boolean
  hasAchievements: boolean
  weeklyCount: number
  achievementsCount: number
}

const UnclaimedCtx = createContext<Ctx | null>(null)

export function UnclaimedProgressProvider({ children }: { children: React.ReactNode }) {
  const {
    hasWeekly,
    hasAchievements,
    weeklyCount,
    achievementsCount,
  } = useUnclaimedProgressSplit()

  // 👇 referencia NUEVA cuando cambie cualquiera de estos valores
  const value = useMemo(
    () => ({ hasWeekly, hasAchievements, weeklyCount, achievementsCount }),
    [hasWeekly, hasAchievements, weeklyCount, achievementsCount]
  )

  return <UnclaimedCtx.Provider value={value}>{children}</UnclaimedCtx.Provider>
}

export function useUnclaimedProgress() {
  const ctx = useContext(UnclaimedCtx)
  if (!ctx) throw new Error('useUnclaimedProgress must be used within UnclaimedProgressProvider')
  return ctx
}
