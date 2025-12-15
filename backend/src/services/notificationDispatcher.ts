import { DateTime } from "luxon"
import {
  deleteTokens,
  fetchActiveNotificationPreferences,
  fetchTokensForUsers,
} from "../db/queries/notificationJobQueries"
import { sendReminderToTokens } from "./pushNotificationService"

const DEFAULT_TIMEZONE = "Europe/Madrid"

function normalizeTime(value: string): string {
  if (!value) return ""
  const trimmed = value.trim()
  if (trimmed.length >= 5) {
    return trimmed.slice(0, 5)
  }
  return trimmed.padStart(5, "0")
}

export async function dispatchPendingNotifications(
  referenceDate: Date = new Date()
): Promise<{
  slot: string
  processedUsers: number
  sent: number
  invalidTokens: number
}> {
  const timezone = process.env.NOTIFICATION_TIMEZONE || DEFAULT_TIMEZONE
  const now = DateTime.fromJSDate(referenceDate, { zone: "utc" }).setZone(timezone)
  const slotMinute = Math.floor(now.minute / 15) * 15
  const slotDate = now.set({ minute: slotMinute, second: 0, millisecond: 0 })
  const slotLabel = slotDate.toFormat("HH:mm")
  const isWeekend = slotDate.weekday === 6 || slotDate.weekday === 7

  const preferences = await fetchActiveNotificationPreferences()
  const dueUsers = preferences.filter((pref) => {
    if (!pref.times?.length) return false
    if (!pref.allow_weekend_notifications && isWeekend) return false
    return pref.times.some((time) => normalizeTime(time) === slotLabel)
  })

  if (!dueUsers.length) {
    return { slot: slotLabel, processedUsers: 0, sent: 0, invalidTokens: 0 }
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

  return {
    slot: slotLabel,
    processedUsers: dueUsers.length,
    sent,
    invalidTokens: invalidTokens.length,
  }
}
