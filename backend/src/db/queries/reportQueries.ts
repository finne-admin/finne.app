import { getPool } from "../../config/dbManager"

export type ErrorReportInput = {
  userId: string
  category: string
  message: string
  pagePath?: string | null
  userAgent?: string | null
  attachmentUrl?: string | null
}

export type ErrorReportStatus = "pending" | "resolved" | "dismissed"

export const insertErrorReport = async (input: ErrorReportInput) => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `
    INSERT INTO error_reports (user_id, category, message, page_path, user_agent, attachment_url, status)
    VALUES ($1, $2, $3, $4, $5, $6, 'pending')
    RETURNING id, user_id, category, message, page_path, attachment_url, status, created_at
    `,
    [
      input.userId,
      input.category,
      input.message,
      input.pagePath ?? null,
      input.userAgent ?? null,
      input.attachmentUrl ?? null,
    ]
  )
  return rows[0]
}

export type ErrorReportListRow = {
  id: string
  user_id: string
  category: string
  message: string
  page_path: string | null
  attachment_url: string | null
  user_agent: string | null
  status: ErrorReportStatus
  created_at: string
  resolved_at: string | null
  resolved_by: string | null
  resolved_by_email: string | null
  admin_reply: string | null
  admin_attachment_url: string | null
  replied_at: string | null
  replied_by: string | null
  replied_by_email: string | null
  reply_read_at: string | null
  user_email: string | null
  user_name: string | null
  organization_name: string | null
  department_name: string | null
}

export const listErrorReports = async (limit = 200): Promise<ErrorReportListRow[]> => {
  const pool = await getPool()
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(Math.floor(limit), 1), 500) : 200
  const { rows } = await pool.query(
    `
    SELECT
      er.id,
      er.user_id,
      er.category,
      er.message,
      er.page_path,
      er.attachment_url,
      er.user_agent,
      er.status,
      er.created_at,
      er.resolved_at,
      er.resolved_by,
      er.admin_reply,
      er.admin_attachment_url,
      er.replied_at,
      er.replied_by,
      er.reply_read_at,
      resolver.email AS resolved_by_email,
      replier.email AS replied_by_email,
      u.email AS user_email,
      NULLIF(TRIM(CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, ''))), '') AS user_name,
      o.name AS organization_name,
      d.name AS department_name
    FROM error_reports er
    LEFT JOIN users u ON u.id = er.user_id
    LEFT JOIN users resolver ON resolver.id = er.resolved_by
    LEFT JOIN users replier ON replier.id = er.replied_by
    LEFT JOIN user_membership um ON um.user_id = er.user_id
    LEFT JOIN organizations o ON o.id = um.organization_id
    LEFT JOIN departments d ON d.id = um.department_id
    ORDER BY er.created_at DESC
    LIMIT $1
    `,
    [safeLimit]
  )
  return rows
}

export const updateErrorReportStatus = async (
  id: string,
  status: ErrorReportStatus,
  resolvedBy: string,
  adminReply?: string | null,
  adminAttachmentUrl?: string | null
) => {
  const pool = await getPool()
  const normalizedReply =
    typeof adminReply === "string" && adminReply.trim().length ? adminReply.trim() : null
  const normalizedAttachment =
    typeof adminAttachmentUrl === "string" && adminAttachmentUrl.trim().length
      ? adminAttachmentUrl.trim()
      : null
  const { rows } = await pool.query(
    `
    UPDATE error_reports
    SET
      status = $2::text,
      resolved_at = CASE WHEN $2::text = 'pending' THEN NULL ELSE NOW() END,
      resolved_by = CASE WHEN $2::text = 'pending' THEN NULL ELSE $3::uuid END,
      admin_reply = CASE
        WHEN $2::text = 'pending' AND $4::text IS NULL AND $5::text IS NULL THEN admin_reply
        ELSE $4::text
      END,
      admin_attachment_url = CASE
        WHEN $2::text = 'pending' AND $4::text IS NULL AND $5::text IS NULL THEN admin_attachment_url
        ELSE $5::text
      END,
      replied_at = CASE
        WHEN $4::text IS NULL AND $5::text IS NULL THEN replied_at
        ELSE NOW()
      END,
      replied_by = CASE
        WHEN $4::text IS NULL AND $5::text IS NULL THEN replied_by
        ELSE $3::uuid
      END,
      reply_read_at = CASE
        WHEN $4::text IS NULL AND $5::text IS NULL THEN reply_read_at
        ELSE NULL
      END
    WHERE id = $1::uuid
    RETURNING id, status, resolved_at, resolved_by, admin_reply, admin_attachment_url, replied_at, replied_by, reply_read_at
    `,
    [id, status, resolvedBy, normalizedReply, normalizedAttachment]
  )
  return rows[0] ?? null
}

export const listErrorReportsByUser = async (userId: string): Promise<ErrorReportListRow[]> => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `
    SELECT
      er.id,
      er.user_id,
      er.category,
      er.message,
      er.page_path,
      er.attachment_url,
      er.user_agent,
      er.status,
      er.created_at,
      er.resolved_at,
      er.resolved_by,
      er.admin_reply,
      er.admin_attachment_url,
      er.replied_at,
      er.replied_by,
      er.reply_read_at,
      resolver.email AS resolved_by_email,
      replier.email AS replied_by_email,
      u.email AS user_email,
      NULLIF(TRIM(CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, ''))), '') AS user_name,
      o.name AS organization_name,
      d.name AS department_name
    FROM error_reports er
    LEFT JOIN users u ON u.id = er.user_id
    LEFT JOIN users resolver ON resolver.id = er.resolved_by
    LEFT JOIN users replier ON replier.id = er.replied_by
    LEFT JOIN user_membership um ON um.user_id = er.user_id
    LEFT JOIN organizations o ON o.id = um.organization_id
    LEFT JOIN departments d ON d.id = um.department_id
    WHERE er.user_id = $1::uuid
    ORDER BY er.created_at DESC
    `,
    [userId]
  )
  return rows
}

export const markErrorReportReplyAsRead = async (id: string, userId: string) => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `
    UPDATE error_reports
    SET reply_read_at = NOW()
    WHERE id = $1::uuid
      AND user_id = $2::uuid
      AND admin_reply IS NOT NULL
      AND reply_read_at IS NULL
    RETURNING id, reply_read_at
    `,
    [id, userId]
  )
  return rows[0] ?? null
}
