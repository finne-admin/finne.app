import { DateTime } from "luxon"
import { listDailyActivePausesByUserId } from "../db/queries/quotaQueries"
import { getMembershipForUser, getDailyActivePauseLimitForUser } from "../db/queries/userMembershipQueries"
import { getOrganizationNotificationDefaults } from "../db/queries/notificationQueries"
import { resolveOrgTimesForDate } from "../utils/notificationTimes"
import { getOrganizationBlockedDayInfoForDateTime } from "./organizationCalendarService"

export const DEFAULT_ACTIVE_PAUSE_TIMEZONE = "Europe/Madrid"
export const FALLBACK_ACTIVE_PAUSE_DAILY_LIMIT = Number(process.env.ACTIVE_PAUSE_DAILY_LIMIT || "3")
export const FALLBACK_ACTIVE_PAUSE_TIMES = ["10:30", "12:00", "15:45"]
const WINDOW_BEFORE_MINUTES = 20
const WINDOW_AFTER_MINUTES = 25

type ActivePauseWindow = {
  label: string
  start: DateTime
  end: DateTime
}

export class ActivePauseWeekendError extends Error {
  constructor() {
    super("Las pausas activas solo estan disponibles de lunes a viernes.")
    this.name = "ActivePauseWeekendError"
  }
}

export class ActivePauseBlockedDayError extends Error {
  constructor() {
    super("Hoy no hay pausas activas porque la organizacion tiene el dia marcado como no laborable.")
    this.name = "ActivePauseBlockedDayError"
  }
}

export class ActivePauseOutsideAllowedWindowError extends Error {
  constructor() {
    super("Estas fuera del horario permitido para realizar la pausa activa.")
    this.name = "ActivePauseOutsideAllowedWindowError"
  }
}

export class ActivePauseWindowAlreadyCompletedError extends Error {
  constructor() {
    super("Ya completaste la pausa correspondiente a este horario.")
    this.name = "ActivePauseWindowAlreadyCompletedError"
  }
}

const buildWindowsForDay = (times: string[], now: DateTime): ActivePauseWindow[] => {
  const day = now.startOf("day")

  return times
    .map((time) => {
      const [hRaw, mRaw] = time.split(":")
      const hour = Number(hRaw)
      const minute = Number(mRaw)

      if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null

      const slot = day.set({ hour, minute, second: 0, millisecond: 0 })
      return {
        label: time,
        start: slot.minus({ minutes: WINDOW_BEFORE_MINUTES }),
        end: slot.plus({ minutes: WINDOW_AFTER_MINUTES }),
      }
    })
    .filter(Boolean) as ActivePauseWindow[]
}

const normalizeScheduleTimes = (times: string[], dailyLimit: number) => {
  const sortedTimes = times
    .map((value) => value.trim())
    .filter(Boolean)
    .sort()

  return sortedTimes.length > dailyLimit ? sortedTimes.slice(0, dailyLimit) : sortedTimes
}

const resolveScheduleTimesForUser = async (userId: string, now: DateTime) => {
  const membership = await getMembershipForUser(userId)
  let times = [...FALLBACK_ACTIVE_PAUSE_TIMES]

  if (membership?.organization_id) {
    const orgDefaults = await getOrganizationNotificationDefaults(membership.organization_id)
    if (orgDefaults) {
      times = resolveOrgTimesForDate(orgDefaults, now, times)
    }
  }

  return times
}

export const resolveActivePauseCreationContext = async (userId: string, now?: DateTime) => {
  const currentTime = now ?? DateTime.now().setZone(DEFAULT_ACTIVE_PAUSE_TIMEZONE)
  const membership = await getMembershipForUser(userId)

  const blockedDay = await getOrganizationBlockedDayInfoForDateTime(
    membership?.organization_id,
    currentTime
  )
  if (blockedDay.blocked) {
    throw new ActivePauseBlockedDayError()
  }

  if (currentTime.weekday === 6 || currentTime.weekday === 7) {
    if (!membership?.organization_id) {
      throw new ActivePauseWeekendError()
    }
  }

  const [times, dailyLimit] = await Promise.all([
    resolveScheduleTimesForUser(userId, currentTime),
    getDailyActivePauseLimitForUser(userId, FALLBACK_ACTIVE_PAUSE_DAILY_LIMIT),
  ])

  const windows = buildWindowsForDay(normalizeScheduleTimes(times, dailyLimit), currentTime)
  const activeWindow = windows.find((window) => currentTime >= window.start && currentTime <= window.end)

  if (!activeWindow) {
    throw new ActivePauseOutsideAllowedWindowError()
  }

  const pausesToday = await listDailyActivePausesByUserId(userId, DEFAULT_ACTIVE_PAUSE_TIMEZONE)
  const alreadyCompleted = pausesToday.some((timestamp) => {
    const pauseTime = DateTime.fromISO(timestamp, { zone: DEFAULT_ACTIVE_PAUSE_TIMEZONE })
    return pauseTime >= activeWindow.start && pauseTime <= activeWindow.end
  })

  if (alreadyCompleted) {
    throw new ActivePauseWindowAlreadyCompletedError()
  }

  return {
    dailyLimit,
    activeWindow,
  }
}
