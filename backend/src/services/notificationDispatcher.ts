import { DateTime } from "luxon"
import {
  deleteTokens,
  fetchActiveNotificationPreferences,
  fetchTipNotificationTargets,
  fetchTokensForUsers,
} from "../db/queries/notificationJobQueries"
import { sendReminderToTokens, sendTipToTokens } from "./pushNotificationService"
import { resolveOrgTimesForDate } from "../utils/notificationTimes"

const DEFAULT_TIMEZONE = "Europe/Madrid"

function normalizeTime(value: string): string {
  if (!value) return ""
  const trimmed = value.trim()
  if (trimmed.length >= 5) {
    return trimmed.slice(0, 5)
  }
  return trimmed.padStart(5, "0")
}

function normalizeSlot(value: string): string | null {
  const normalized = normalizeTime(value)
  return normalized ? normalized : null
}

function buildTipSlots(slotDate: DateTime, times: string[]): Set<string> {
  const slots = new Set<string>()
  for (const time of times) {
    const normalized = normalizeSlot(time)
    if (!normalized) continue
    const [hourStr, minuteStr] = normalized.split(":")
    const hour = Number(hourStr)
    const minute = Number(minuteStr)
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) continue
    const base = slotDate.set({ hour, minute })
    slots.add(base.minus({ minutes: 20 }).toFormat("HH:mm"))
    slots.add(base.plus({ minutes: 20 }).toFormat("HH:mm"))
  }
  return slots
}

export async function dispatchPendingNotifications(
  referenceDate: Date = new Date()
): Promise<{
  slot: string
  processedUsers: number
  sent: number
  invalidTokens: number
  tipsProcessedUsers: number
  tipsSent: number
  tipsInvalidTokens: number
}> {
  const timezone = process.env.NOTIFICATION_TIMEZONE || DEFAULT_TIMEZONE
  const now = DateTime.fromJSDate(referenceDate, { zone: "utc" }).setZone(timezone)
  const slotDate = now.set({ second: 0, millisecond: 0 })
  const slotLabel = slotDate.toFormat("HH:mm")
  const isWeekend = slotDate.weekday === 6 || slotDate.weekday === 7

  const preferences = await fetchActiveNotificationPreferences()
  const dueUsers = preferences.filter((pref) => {
    if (!pref.times?.length) return false
    if (!pref.allow_weekend_notifications && isWeekend) return false
    return pref.times.some((time) => normalizeTime(time) === slotLabel)
  })

  if (!dueUsers.length) {
    // still process tips even if no pause reminders
    const tipResult = await dispatchTips(slotDate, slotLabel, isWeekend)
    return {
      slot: slotLabel,
      processedUsers: 0,
      sent: 0,
      invalidTokens: 0,
      tipsProcessedUsers: tipResult.processedUsers,
      tipsSent: tipResult.sent,
      tipsInvalidTokens: tipResult.invalidTokens,
    }
  }

  const userIds = dueUsers.map((pref) => pref.user_id)
  const tokensMap = await fetchTokensForUsers(userIds)

  let sent = 0
  let invalidTokens: string[] = []

  for (const pref of dueUsers) {
    const tokens = tokensMap[pref.user_id] || []
    if (!tokens.length) continue

    const result = await sendReminderToTokens(tokens, {
      userId: pref.user_id,
      reminderLabel: slotLabel,
      reminderIso: slotDate.toISO() ?? new Date().toISOString(),
    })

    sent += result.successCount
    invalidTokens = invalidTokens.concat(result.failedTokens)
  }

  if (invalidTokens.length) {
    await deleteTokens(invalidTokens)
  }

  const tipResult = await dispatchTips(slotDate, slotLabel, isWeekend)

  return {
    slot: slotLabel,
    processedUsers: dueUsers.length,
    sent,
    invalidTokens: invalidTokens.length,
    tipsProcessedUsers: tipResult.processedUsers,
    tipsSent: tipResult.sent,
    tipsInvalidTokens: tipResult.invalidTokens,
  }
}

async function dispatchTips(
  slotDate: DateTime,
  slotLabel: string,
  isWeekend: boolean
): Promise<{ processedUsers: number; sent: number; invalidTokens: number }> {
  const tipTargets = await fetchTipNotificationTargets()
  const dueTips = tipTargets.filter((target) => {
    const resolved = resolveOrgTimesForDate(
      {
        default_notification_times: target.times,
        default_notification_times_by_day: target.times_by_day,
      },
      slotDate,
      target.times || []
    )
    if (!resolved?.length) return false
    if (!target.allow_weekend_notifications && isWeekend) return false
    const tipSlots = buildTipSlots(slotDate, resolved)
    return tipSlots.has(slotLabel)
  })

  if (!dueTips.length) {
    return { processedUsers: 0, sent: 0, invalidTokens: 0 }
  }

  const userIds = dueTips.map((target) => target.user_id)
  const tokensMap = await fetchTokensForUsers(userIds)

  let sent = 0
  let invalidTokens: string[] = []

  for (const target of dueTips) {
    const tokens = tokensMap[target.user_id] || []
    if (!tokens.length) continue

    const result = await sendTipToTokens(tokens, {
      userId: target.user_id,
      tipLabel: slotLabel,
      tipIso: slotDate.toISO() ?? new Date().toISOString(),
    })

    sent += result.successCount
    invalidTokens = invalidTokens.concat(result.failedTokens)
  }

  if (invalidTokens.length) {
    await deleteTokens(invalidTokens)
  }

  return {
    processedUsers: dueTips.length,
    sent,
    invalidTokens: invalidTokens.length,
  }
}
