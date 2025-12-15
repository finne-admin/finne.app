type ZonedInfo = {
  isoDate: string
  weekday: number // 1 = Monday
}

const weekdayMap: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
}

const dateFormatters = new Map<string, Intl.DateTimeFormat>()
const weekdayFormatters = new Map<string, Intl.DateTimeFormat>()

const getDateFormatter = (timeZone: string) => {
  if (!dateFormatters.has(timeZone)) {
    dateFormatters.set(
      timeZone,
      new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    )
  }
  return dateFormatters.get(timeZone)!
}

const getWeekdayFormatter = (timeZone: string) => {
  if (!weekdayFormatters.has(timeZone)) {
    weekdayFormatters.set(
      timeZone,
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        weekday: "short",
      })
    )
  }
  return weekdayFormatters.get(timeZone)!
}

export const getZonedDateInfo = (date: Date, timeZone: string): ZonedInfo => {
  const dateFormatter = getDateFormatter(timeZone)
  const weekdayFormatter = getWeekdayFormatter(timeZone)

  const iso = dateFormatter.format(date) // en-CA -> YYYY-MM-DD
  const weekdayStr = weekdayFormatter.format(date)
  const weekday = weekdayMap[weekdayStr] ?? 1

  return {
    isoDate: iso,
    weekday,
  }
}

export const shiftDateByDays = (date: Date, days: number) => {
  const next = new Date(date.getTime())
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

export const previousWorkdayDate = (date: Date, timeZone: string) => {
  let cursor = shiftDateByDays(date, -1)
  let info = getZonedDateInfo(cursor, timeZone)
  while (info.weekday > 5) {
    cursor = shiftDateByDays(cursor, -1)
    info = getZonedDateInfo(cursor, timeZone)
  }
  return cursor
}

export const nextCalendarDay = (date: Date) => shiftDateByDays(date, 1)
