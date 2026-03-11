import { getPool } from "../../config/dbManager"

export type ErrorReportInput = {
  userId: string
  category: string
  message: string
  pagePath?: string | null
  userAgent?: string | null
}

export type ErrorReportStatus = "pending" | "resolved" | "dismissed"

export const insertErrorReport = async (input: ErrorReportInput) => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `
    INSERT INTO error_reports (user_id, category, message, page_path, user_agent, status)
    VALUES ($1, $2, $3, $4, $5, 'pending')
    RETURNING id, user_id, category, message, page_path, status, created_at
    `,
    [
      input.userId,
      input.category,
      input.message,
      input.pagePath ?? null,
      input.userAgent ?? null,
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
  user_agent: string | null
  status: ErrorReportStatus
  created_at: string
  resolved_at: string | null
  resolved_by: string | null
  resolved_by_email: string | null
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
      er.user_agent,
      er.status,
      er.created_at,
      er.resolved_at,
      er.resolved_by,
      resolver.email AS resolved_by_email,
      u.email AS user_email,
      NULLIF(TRIM(CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, ''))), '') AS user_name,
      o.name AS organization_name,
      d.name AS department_name
    FROM error_reports er
    LEFT JOIN users u ON u.id = er.user_id
    LEFT JOIN users resolver ON resolver.id = er.resolved_by
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
  resolvedBy: string
) => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `
    UPDATE error_reports
    SET
      status = $2::text,
      resolved_at = CASE WHEN $2::text = 'pending' THEN NULL ELSE NOW() END,
      resolved_by = CASE WHEN $2::text = 'pending' THEN NULL ELSE $3::uuid END
    WHERE id = $1::uuid
    RETURNING id, status, resolved_at, resolved_by
    `,
    [id, status, resolvedBy]
  )
  return rows[0] ?? null
}
