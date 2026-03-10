import { getPool } from "../../config/dbManager"

export type ErrorReportInput = {
  userId: string
  category: string
  message: string
  pagePath?: string | null
  userAgent?: string | null
}

export const insertErrorReport = async (input: ErrorReportInput) => {
  const pool = await getPool()
  const { rows } = await pool.query(
    `
    INSERT INTO error_reports (user_id, category, message, page_path, user_agent)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, user_id, category, message, page_path, created_at
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
  created_at: string
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
      er.created_at,
      u.email AS user_email,
      NULLIF(TRIM(CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, ''))), '') AS user_name,
      o.name AS organization_name,
      d.name AS department_name
    FROM error_reports er
    LEFT JOIN users u ON u.id = er.user_id
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
