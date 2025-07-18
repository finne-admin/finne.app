import { DateTime } from 'luxon'

export function getActiveStreak(dates: string[]): number {
  const uniqueDates = Array.from(new Set(dates))
  const parsedDates = uniqueDates
    .map((d) => DateTime.fromISO(d).startOf('day'))
    .filter((d) => d.weekday <= 5) // solo L-V
    .sort((a, b) => b.toMillis() - a.toMillis()) // recientes primero

  let streak = 0
  let current = DateTime.local().startOf('day')

  // Si hoy es laborable y aún NO está en la lista de fechas → ignorar hoy
  const todayIsWeekday = current.weekday <= 5
  const hasPausedToday = parsedDates.some((d) => d.equals(current))
  const ignoreToday = todayIsWeekday && !hasPausedToday

  if (ignoreToday) {
    // Empezamos a contar desde ayer laborable
    do {
      current = current.minus({ days: 1 })
    } while (current.weekday > 5)
  }

  for (const date of parsedDates) {
    if (date.equals(current)) {
      streak++
      do {
        current = current.minus({ days: 1 })
      } while (current.weekday > 5)
    } else {
      break
    }
  }

  return streak
}
