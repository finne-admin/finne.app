import { getPool } from "../../config/dbManager"

export type OrganizationBlackoutDateRow = {
  id: string
  organization_id: string
  blocked_date: string
  reason: string | null
  created_by: string | null
  created_at: string
}

export type OrganizationCalendarSettingsRow = {
  id: string
  name: string
  slug: string
  disable_saturdays: boolean
  disable_sundays: boolean
}

export const listOrganizationCalendarSettings = async () => {
  const pool = await getPool()
  const { rows } = await pool.query<OrganizationCalendarSettingsRow>(
    `
    SELECT
      id,
      name,
      slug,
      disable_saturdays,
      disable_sundays
    FROM organizations
    ORDER BY name
    `
  )

  return rows
}

export const getOrganizationCalendarSettingsById = async (organizationId: string) => {
  const pool = await getPool()
  const { rows } = await pool.query<OrganizationCalendarSettingsRow>(
    `
    SELECT
      id,
      name,
      slug,
      disable_saturdays,
      disable_sundays
    FROM organizations
    WHERE id = $1
    `,
    [organizationId]
  )

  return rows[0] ?? null
}

export const listOrganizationBlackoutDatesById = async (organizationId: string) => {
  const pool = await getPool()
  const { rows } = await pool.query<OrganizationBlackoutDateRow>(
    `
    SELECT
      id,
      organization_id,
      blocked_date::text,
      reason,
      created_by,
      created_at::text
    FROM organization_blackout_dates
    WHERE organization_id = $1
    ORDER BY blocked_date ASC
    `,
    [organizationId]
  )

  return rows
}

export const replaceOrganizationBlackoutDates = async (
  organizationId: string,
  blackoutDates: Array<{ blocked_date: string; reason: string | null }>,
  updatedBy: string | null
) => {
  const pool = await getPool()
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    await client.query(`DELETE FROM organization_blackout_dates WHERE organization_id = $1`, [
      organizationId,
    ])

    for (const blackout of blackoutDates) {
      await client.query(
        `
        INSERT INTO organization_blackout_dates (
          organization_id,
          blocked_date,
          reason,
          created_by,
          created_at
        )
        VALUES ($1, $2::date, $3, $4, NOW())
        `,
        [organizationId, blackout.blocked_date, blackout.reason, updatedBy]
      )
    }

    await client.query("COMMIT")
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

export const updateOrganizationWeekendRules = async (
  organizationId: string,
  disableSaturdays: boolean,
  disableSundays: boolean
) => {
  const pool = await getPool()
  const { rows } = await pool.query<OrganizationCalendarSettingsRow>(
    `
    UPDATE organizations
    SET
      disable_saturdays = $2,
      disable_sundays = $3
    WHERE id = $1
    RETURNING
      id,
      name,
      slug,
      disable_saturdays,
      disable_sundays
    `,
    [organizationId, disableSaturdays, disableSundays]
  )

  return rows[0] ?? null
}

export const findBlockedOrganizationIdsForDate = async (
  isoDate: string,
  organizationIds: string[]
) => {
  if (!organizationIds.length) return new Set<string>()

  const pool = await getPool()
  const { rows } = await pool.query<{ organization_id: string }>(
    `
    SELECT DISTINCT organization_id
    FROM organization_blackout_dates
    WHERE blocked_date = $1::date
      AND organization_id = ANY($2::uuid[])
    `,
    [isoDate, organizationIds]
  )

  return new Set(rows.map((row) => row.organization_id))
}
