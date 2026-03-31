import { getPool } from "../../config/dbManager"

export type AnnouncementRow = {
  id: string
  title: string | null
  message: string
  starts_at: Date
  active: boolean
  created_by: string | null
  created_at: Date
  updated_at: Date
}

export type AnnouncementWithOrganizationsRow = AnnouncementRow & {
  organization_ids: string[] | null
  organization_names: string[] | null
}

const baseSelect = `
  SELECT
    ga.id,
    ga.title,
    ga.message,
    ga.starts_at,
    ga.active,
    ga.created_by,
    ga.created_at,
    ga.updated_at,
    COALESCE(
      ARRAY_AGG(gao.organization_id ORDER BY o.name)
        FILTER (WHERE gao.organization_id IS NOT NULL),
      ARRAY[]::uuid[]
    ) AS organization_ids,
    COALESCE(
      ARRAY_AGG(o.name ORDER BY o.name)
        FILTER (WHERE o.name IS NOT NULL),
      ARRAY[]::text[]
    ) AS organization_names
  FROM global_announcements ga
  LEFT JOIN global_announcement_organizations gao ON gao.announcement_id = ga.id
  LEFT JOIN organizations o ON o.id = gao.organization_id
`

export const listAnnouncements = async () => {
  const pool = await getPool()
  const { rows } = await pool.query<AnnouncementWithOrganizationsRow>(
    `
    ${baseSelect}
    GROUP BY ga.id
    ORDER BY ga.starts_at DESC, ga.created_at DESC
    `
  )
  return rows
}

export const upsertAnnouncement = async (params: {
  id?: string
  title?: string | null
  message: string
  startsAt: string
  active: boolean
  organizationIds: string[]
  createdBy: string | null
}) => {
  const pool = await getPool()
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const { rows } = await client.query<AnnouncementRow>(
      params.id
        ? `
          UPDATE global_announcements
          SET
            title = $2,
            message = $3,
            starts_at = $4,
            active = $5,
            updated_at = NOW()
          WHERE id = $1
          RETURNING *
        `
        : `
          INSERT INTO global_announcements (
            title,
            message,
            starts_at,
            active,
            created_by
          )
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `,
      params.id
        ? [params.id, params.title ?? null, params.message, params.startsAt, params.active]
        : [params.title ?? null, params.message, params.startsAt, params.active, params.createdBy]
    )

    const announcement = rows[0]
    if (!announcement) {
      throw new Error("No se pudo guardar el aviso")
    }

    await client.query(`DELETE FROM global_announcement_organizations WHERE announcement_id = $1`, [
      announcement.id,
    ])

    for (const organizationId of params.organizationIds) {
      await client.query(
        `
        INSERT INTO global_announcement_organizations (announcement_id, organization_id)
        VALUES ($1, $2)
        `,
        [announcement.id, organizationId]
      )
    }

    await client.query("COMMIT")
    return announcement
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

export const getAnnouncementById = async (id: string) => {
  const pool = await getPool()
  const { rows } = await pool.query<AnnouncementWithOrganizationsRow>(
    `
    ${baseSelect}
    WHERE ga.id = $1
    GROUP BY ga.id
    `,
    [id]
  )
  return rows[0] ?? null
}

export const getPendingAnnouncementForUser = async (params: {
  userId: string
  organizationId: string | null
}) => {
  if (!params.organizationId) return null

  const pool = await getPool()
  const { rows } = await pool.query<AnnouncementWithOrganizationsRow>(
    `
    ${baseSelect}
    LEFT JOIN global_announcement_reads gar
      ON gar.announcement_id = ga.id
     AND gar.user_id = $2
    WHERE ga.active = TRUE
      AND ga.starts_at <= NOW()
      AND gao.organization_id = $1
      AND gar.announcement_id IS NULL
    GROUP BY ga.id
    ORDER BY ga.starts_at ASC, ga.created_at ASC
    LIMIT 1
    `,
    [params.organizationId, params.userId]
  )
  return rows[0] ?? null
}

export const markAnnouncementRead = async (announcementId: string, userId: string) => {
  const pool = await getPool()
  await pool.query(
    `
    INSERT INTO global_announcement_reads (announcement_id, user_id)
    VALUES ($1, $2)
    ON CONFLICT (announcement_id, user_id) DO NOTHING
    `,
    [announcementId, userId]
  )
}
