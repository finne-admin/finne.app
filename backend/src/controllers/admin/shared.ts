import { findDepartmentById, findOrganizationById } from "../../db/queries/adminQueries"

export const MIN_DAILY_PAUSES = 1
export const MAX_DAILY_PAUSES = 50

export const parsePgArray = (value: unknown): string[] => {
  if (!value) return []
  if (Array.isArray(value)) return value as string[]

  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
      return [trimmed]
    }

    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item) => item.replace(/(^"|"$)/g, "").trim())
      .filter(Boolean)
  }

  return []
}

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/

export const normalizeTimesInput = (value: unknown): string[] => {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("Debes proporcionar al menos un horario")
  }

  const normalized = (value as unknown[]).map((item) => {
    if (typeof item !== "string") {
      throw new Error("Los horarios deben ser cadenas en formato HH:MM")
    }

    const trimmed = item.trim()
    if (!TIME_REGEX.test(trimmed)) {
      throw new Error(`Formato invalido para el horario ${trimmed}`)
    }

    return trimmed
  })

  const unique = Array.from(new Set(normalized))
  unique.sort()
  return unique
}

export const normalizeTimesByDay = (value: unknown): Record<string, string[]> | null | undefined => {
  if (value === undefined) return undefined
  if (value === null) return null
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error("El formato de horarios por dia es invalido")
  }

  const input = value as Record<string, unknown>
  const normalized: Record<string, string[]> = {}

  Object.entries(input).forEach(([key, rawTimes]) => {
    if (rawTimes === null || rawTimes === undefined) return
    if (!Array.isArray(rawTimes)) {
      throw new Error(`Horarios invalidos para ${key}`)
    }

    if (rawTimes.length === 0) {
      normalized[key] = []
      return
    }

    normalized[key] = normalizeTimesInput(rawTimes)
  })

  return normalized
}

export const mapAdminUserRows = (rows: any[]) =>
  rows.map((row) => ({
    ...row,
    last_active: row.last_active ? new Date(row.last_active).toISOString() : null,
    registration_requested_at: row.registration_requested_at
      ? new Date(row.registration_requested_at).toISOString()
      : null,
    approved_at: row.approved_at ? new Date(row.approved_at).toISOString() : null,
    organization_name: row.organization_name,
    department_name: row.department_name,
    role_id: row.role_id,
    role_name: row.role_name,
    role_scope: row.role_scope,
  }))

export const isSuperAdmin = (user?: any) =>
  user?.roleName?.toLowerCase() === "superadmin" || user?.roleScope === "global"

export const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")

export const validateOrganizationDepartmentScope = async (
  organizationId: string,
  departmentId?: string | null
) => {
  const organization = await findOrganizationById(organizationId)
  if (!organization) {
    throw new Error("ORGANIZATION_NOT_FOUND")
  }

  if (!departmentId) {
    return { organization, department: null }
  }

  const department = await findDepartmentById(departmentId)
  if (!department) {
    throw new Error("DEPARTMENT_NOT_FOUND")
  }

  if (department.organization_id !== organizationId) {
    throw new Error("DEPARTMENT_SCOPE_MISMATCH")
  }

  return { organization, department }
}
