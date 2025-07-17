// utils/getActiveStreak.ts
import { DateTime } from 'luxon'

export function getActiveStreak(dates: string[]): number {
  const uniqueDates = Array.from(new Set(dates)) // por si hay múltiples pausas el mismo día
  const parsedDates = uniqueDates
    .map((d) => DateTime.fromISO(d).startOf('day'))
    .filter((d) => d.weekday <= 5) // 1 = lunes, 7 = domingo → solo L-V
    .sort((a, b) => b.toMillis() - a.toMillis()) // más recientes primero

  let streak = 0
  let current = DateTime.local().startOf('day')

  for (const date of parsedDates) {
    if (date.equals(current)) {
      streak++
      current = current.minus({ days: 1 })
      while (current.weekday > 5) current = current.minus({ days: 1 }) // saltar finde
    } else {
      break
    }
  }

  return streak
}
