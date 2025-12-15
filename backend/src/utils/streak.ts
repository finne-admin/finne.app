import { getZonedDateInfo, previousWorkdayDate } from "./timezone"

export const calculateWorkdayStreak = (dates: string[], timeZone = "Europe/Madrid") => {
  if (!dates || dates.length === 0) return 0

  const normalized = new Set<string>()
  for (const raw of dates) {
    if (!raw) continue
    const info = getZonedDateInfo(new Date(raw), timeZone)
    normalized.add(info.isoDate)
  }

  if (normalized.size === 0) {
    return 0
  }

  let cursor = new Date()
  let info = getZonedDateInfo(cursor, timeZone)

  if (info.weekday <= 5 && !normalized.has(info.isoDate)) {
    cursor = previousWorkdayDate(cursor, timeZone)
    info = getZonedDateInfo(cursor, timeZone)
  }

  let streak = 0
  while (info.weekday <= 5 && normalized.has(info.isoDate)) {
    streak += 1
    cursor = previousWorkdayDate(cursor, timeZone)
    info = getZonedDateInfo(cursor, timeZone)
  }

  return streak
}
