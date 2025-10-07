import { DateTime } from 'luxon'

/** Devuelve el anterior día laborable (L–V) en la zona dada */
function previousWorkday(dt: DateTime): DateTime {
  let cur = dt.minus({ days: 1 })
  while (cur.weekday > 5) cur = cur.minus({ days: 1 })
  return cur
}

/**
 * dates puede contener:
 *  - 'YYYY-MM-DD' ya en zona destino, o
 *  - ISO UTC (created_at). Ambos valen.
 */
export function getActiveStreak(
  dates: string[],
  zone: string = 'Europe/Madrid',
  withLogs = false
): number {
  const toIsoDateInZone = (s: string) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s // ya viene como fecha civil
    return DateTime.fromISO(s, { zone: 'utc' }).setZone(zone).toISODate()!
  }

  // Normaliza a set de YYYY-MM-DD (zona destino)
  const set = new Set(
    Array.from(new Set(dates))
      .map(toIsoDateInZone)
      .filter(Boolean) as string[]
  )

  let cur = DateTime.now().setZone(zone).startOf('day')
  const todayStr = cur.toISODate()!
  const todayIsWeekday = cur.weekday <= 5
  const hasToday = set.has(todayStr)

  if (todayIsWeekday && !hasToday) cur = previousWorkday(cur)

  let streak = 0
  const touched: string[] = []

  while (cur.weekday <= 5 && set.has(cur.toISODate()!)) {
    touched.push(cur.toISODate()!)
    streak++
    cur = previousWorkday(cur)
  }

  if (withLogs) {
    // 👇 esto te dirá exactamente qué días está contando
    // y qué días hay realmente registrados
    // (puedes quitar los logs cuando confirmes)
    // eslint-disable-next-line no-console
    console.log('[streak] zone=', zone, {
      todayStr,
      inputDates: Array.from(set).sort(),
      counted: touched,
      result: streak,
    })
  }

  return streak
}
