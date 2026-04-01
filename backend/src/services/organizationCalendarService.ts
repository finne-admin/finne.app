import { DateTime } from "luxon"
import {
  findBlockedOrganizationIdsForDate,
  getOrganizationCalendarSettingsById,
} from "../db/queries/organizationCalendarQueries"

type OrganizationDayRuleInput = {
  organizationId: string | null | undefined
  isoDate: string
  weekday: number
}

export const isWeekendBlockedByOrganizationRules = (
  weekday: number,
  disableSaturdays: boolean,
  disableSundays: boolean
) => {
  if (weekday === 6 && disableSaturdays) return true
  if (weekday === 7 && disableSundays) return true
  return false
}

export const getOrganizationBlockedDayInfo = async ({
  organizationId,
  isoDate,
  weekday,
}: OrganizationDayRuleInput) => {
  if (!organizationId) {
    return { blocked: false, reason: null as string | null }
  }

  const settings = await getOrganizationCalendarSettingsById(organizationId)
  if (!settings) {
    return { blocked: false, reason: null as string | null }
  }

  if (
    isWeekendBlockedByOrganizationRules(
      weekday,
      settings.disable_saturdays,
      settings.disable_sundays
    )
  ) {
    return {
      blocked: true,
      reason: weekday === 6 ? "Sabado no laborable" : "Domingo no laborable",
    }
  }

  const blockedOrganizations = await findBlockedOrganizationIdsForDate(isoDate, [organizationId])
  if (blockedOrganizations.has(organizationId)) {
    return { blocked: true, reason: "Dia no laborable configurado por la organizacion" }
  }

  return { blocked: false, reason: null as string | null }
}

export const getOrganizationBlockedDayInfoForDateTime = async (
  organizationId: string | null | undefined,
  dateTime: DateTime
) =>
  getOrganizationBlockedDayInfo({
    organizationId,
    isoDate: dateTime.toISODate() ?? "",
    weekday: dateTime.weekday,
  })
