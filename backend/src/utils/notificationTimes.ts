import { DateTime } from "luxon"

export const WEEKDAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const
export type WeekdayKey = (typeof WEEKDAY_KEYS)[number]

const normalizeTimeValue = (value: unknown): string | null => {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed
}

export const toTimesArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return (value as unknown[]).map((item) => String(item))
  }
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      return trimmed
        .slice(1, -1)
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean)
    }
    return [trimmed]
  }
  return []
}

const parseTimesByDay = (value: unknown): Record<string, string[]> | null => {
  if (!value) return null
  let raw: any = value
  if (typeof value === "string") {
    try {
      raw = JSON.parse(value)
    } catch {
      return null
    }
  }
  if (typeof raw !== "object" || Array.isArray(raw)) return null

  const normalized: Record<string, string[]> = {}
  for (const key of Object.keys(raw)) {
    const times = toTimesArray(raw[key])
      .map((item) => normalizeTimeValue(item))
      .filter(Boolean) as string[]
    normalized[key] = times
  }
  return normalized
}

export const getWeekdayKey = (dt: DateTime): WeekdayKey => {
  // luxon weekday: 1=Mon ... 7=Sun
  return WEEKDAY_KEYS[(dt.weekday - 1) % 7]
}

export const resolveOrgTimesForDate = (
  defaults: {
    default_notification_times?: unknown
    default_notification_times_by_day?: unknown
  } | null,
  now: DateTime,
  fallback: string[]
): string[] => {
  if (!defaults) return fallback
  const byDay = parseTimesByDay(defaults.default_notification_times_by_day)
  const dayKey = getWeekdayKey(now)
  const dayTimes = byDay?.[dayKey]
  if (dayTimes && dayTimes.length) {
    return dayTimes
  }
  const orgTimes = toTimesArray(defaults.default_notification_times)
  return orgTimes.length ? orgTimes : fallback
}
