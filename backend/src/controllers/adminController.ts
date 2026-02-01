import { Request, Response } from "express"
import bcrypt from "bcrypt"
import {
  approveUserAccount,
  rejectUserAccount,
  updateUserPasswordById,
} from "../db/queries/userQueries"
import {
  deleteAdminUser,
  fetchAdminUsers,
  fetchExerciseSatisfactionRecords,
  createDepartment,
  createOrganization,
  fetchOrganizationStructure,
  findDepartmentById,
  findOrganizationById,
  listOrganizationNotificationDefaults as listOrganizationNotificationDefaultsQuery,
  updateAdminUser,
  updateOrganizationDailyLimitById,
  updateOrganizationNotificationDefaultsById,
  listOrganizationSeasonTimers as listOrganizationSeasonTimersQuery,
  updateOrganizationSeasonTimerById,
  updateUserRoleById,
  resetOrganizationScopeData,
} from "../db/queries/adminQueries"
import {
  createJoinCode as createJoinCodeQuery,
  deleteJoinCodeById,
  findJoinCodeByCode,
  listJoinCodes,
} from "../db/queries/joinCodeQueries"
import { getMembershipForUser, upsertUserMembership } from "../db/queries/userMembershipQueries"
import { findRoleById, listRoles } from "../db/queries/roleQueries"

// Utilidades de parseo y validacion de entradas comunes.
const parsePgArray = (value: unknown): string[] => {
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

const normalizeTimesInput = (value: unknown): string[] => {
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

const mapUserRows = (rows: any[]) =>
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

const isSuperAdmin = (user?: any) =>
  user?.roleName?.toLowerCase() === "superadmin" || user?.roleScope === "global"

// Lista usuarios filtrando por organizacion/departamento segun el rol del solicitante.
export const listUsers = async (req: Request, res: Response) => {
  try {
    const requester = (req as any).user
    if (!requester) {
      return res.status(401).json({ error: "No autenticado" })
    }

    const scope = typeof req.query.scope === "string" ? req.query.scope.toLowerCase() : "organization"
    const requestedOrg = typeof req.query.organizationId === "string" ? req.query.organizationId : undefined
    const requestedDept = typeof req.query.departmentId === "string" ? req.query.departmentId : undefined

    const filters: { organizationId?: string; departmentId?: string } = {}
    const allowGlobal = scope === "global" && isSuperAdmin(requester)

    if (allowGlobal) {
      if (requestedOrg) filters.organizationId = requestedOrg
      if (requestedDept) filters.departmentId = requestedDept
    } else {
      const membership = await getMembershipForUser(requester.id)
      if (!membership?.organization_id) {
        return res.status(403).json({ error: "Tu cuenta no esta asociada a ninguna organizacion" })
      }
      filters.organizationId = membership.organization_id
      if (requestedDept) {
        filters.departmentId = requestedDept
      }
    }

    const rows = await fetchAdminUsers(filters)
    return res.json({ users: mapUserRows(rows) })
  } catch (error) {
    console.error("Error listing users:", error)
    return res.status(500).json({ error: "Error al obtener la lista de usuarios" })
  }
}

// Actualiza datos basicos de un usuario.
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params
  const { first_name, last_name, email } = req.body || {}

  if (!id) {
    return res.status(400).json({ error: "Falta el ID del usuario" })
  }

  try {
    const updatedUser = await updateAdminUser({ id, first_name, last_name, email })
    if (!updatedUser) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    return res.json({ user: updatedUser })
  } catch (error: any) {
    if (error?.code === "23505") {
      return res.status(400).json({ error: "El correo ya esta registrado" })
    }
    console.error("Error updating user:", error)
    return res.status(500).json({ error: "Error al actualizar el usuario" })
  }
}

// Elimina un usuario por ID.
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: "Falta el ID del usuario" })
  }

  try {
    const deleted = await deleteAdminUser(id)
    if (deleted === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    return res.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return res.status(500).json({ error: "Error al eliminar el usuario" })
  }
}

// Cambia la contrasena de un usuario.
export const changeUserPassword = async (req: Request, res: Response) => {
  const { id } = req.params
  const { newPassword } = req.body as { newPassword?: string }

  if (!id) {
    return res.status(400).json({ error: "Falta el ID del usuario" })
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: "La nueva contrasena debe tener al menos 6 caracteres" })
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await updateUserPasswordById(id, hashedPassword)
    return res.json({ success: true })
  } catch (error) {
    console.error("Error updating password:", error)
    return res.status(500).json({ error: "Error al actualizar la contrasena" })
  }
}

// Aprueba una solicitud de usuario.
export const approveUserRequest = async (req: Request, res: Response) => {
  const { id } = req.params
  const adminId = (req as any).user?.id as string | undefined

  if (!id) {
    return res.status(400).json({ error: "Falta el ID del usuario" })
  }

  if (!adminId) {
    return res.status(401).json({ error: "No autenticado" })
  }

  try {
    const updated = await approveUserAccount(id, adminId)
    if (!updated) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    return res.json({ success: true, user: updated })
  } catch (error) {
    console.error("Error approving user:", error)
    return res.status(500).json({ error: "Error al aprobar la solicitud" })
  }
}

// Rechaza una solicitud de usuario.
export const rejectUserRequest = async (req: Request, res: Response) => {
  const { id } = req.params
  const adminId = (req as any).user?.id as string | undefined

  if (!id) {
    return res.status(400).json({ error: "Falta el ID del usuario" })
  }

  if (!adminId) {
    return res.status(401).json({ error: "No autenticado" })
  }

  try {
    const updated = await rejectUserAccount(id, adminId)
    if (!updated) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    return res.json({ success: true, user: updated })
  } catch (error) {
    console.error("Error rejecting user:", error)
    return res.status(500).json({ error: "Error al rechazar la solicitud" })
  }
}

// Devuelve registros de satisfaccion de ejercicios (limitados).
export const getExerciseSatisfaction = async (req: Request, res: Response) => {
  const limitParam = req.query.limit ? parseInt(String(req.query.limit), 10) : 1000
  const limit = Number.isNaN(limitParam) ? 1000 : Math.min(Math.max(limitParam, 1), 5000)

  try {
    const rows = await fetchExerciseSatisfactionRecords(limit)

    const normalized = rows.map((row) => ({
      ...row,
      video_hash_ids: parsePgArray(row.video_hash_ids),
      tags: parsePgArray(row.tags),
      created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
    }))

    return res.json({ records: normalized })
  } catch (error) {
    console.error("Error fetching exercise satisfaction data:", error)
    return res.status(500).json({ error: "Error al obtener datos de ejercicios" })
  }
}

const randomSegment = () =>
  Math.random().toString(36).replace(/[^a-z0-9]+/gi, "").toUpperCase().slice(0, 3)

const generateJoinCodeValue = () => `${randomSegment()}-${randomSegment()}`
const normalizeCodeInput = (value: string) => value.trim().toUpperCase()
const MIN_DAILY_PAUSES = 1
const MAX_DAILY_PAUSES = 50

const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")

export const listJoinCodesController = async (_req: Request, res: Response) => {
  try {
    const codes = await listJoinCodes()
    return res.json({ codes })
  } catch (error) {
    console.error("Error listando codigos:", error)
    return res.status(500).json({ error: "Error al obtener codigos" })
  }
}

// Crea un codigo de invitacion para una organizacion/departamento.
export const createJoinCodeController = async (req: Request, res: Response) => {
  const { organizationId, departmentId, expiresAt, maxUses, autoApprove, code } = req.body || {}
  if (!organizationId || !departmentId) {
    return res.status(400).json({ error: "Faltan organizacion o departamento" })
  }

  try {
    const organization = await findOrganizationById(organizationId)
    if (!organization) {
      return res.status(404).json({ error: "Organizacion no encontrada" })
    }

    const department = await findDepartmentById(departmentId)
    if (!department) {
      return res.status(404).json({ error: "Departamento no encontrado" })
    }

    if (department.organization_id !== organizationId) {
      return res
        .status(400)
        .json({ error: "El departamento no pertenece a la organizacion seleccionada" })
    }

    const normalizedCode = code ? normalizeCodeInput(code) : generateJoinCodeValue()

    if (!/^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(normalizedCode)) {
      return res.status(400).json({ error: "El codigo debe tener formato XXX-YYY" })
    }

    const parsedMaxUses = typeof maxUses === "number" && maxUses > 0 ? Math.floor(maxUses) : null

    let parsedExpiresAt: Date | null = null
    if (expiresAt) {
      const date = new Date(expiresAt)
      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({ error: "Fecha de expiracion invalida" })
      }
      parsedExpiresAt = date
    }

    const createdBy = (req as any).user?.id ?? null

    const created = await createJoinCodeQuery({
      organizationId,
      departmentId,
      code: normalizedCode,
      autoApprove: Boolean(autoApprove),
      maxUses: parsedMaxUses,
      expiresAt: parsedExpiresAt || null,
      createdBy,
    })

    const record = await findJoinCodeByCode(normalizedCode)
    return res.status(201).json({ code: record ?? created })
  } catch (error: any) {
    if (error?.code === "23505") {
      return res.status(400).json({ error: "El codigo ya esta en uso" })
    }
    console.error("Error creando codigo:", error)
    return res.status(500).json({ error: "Error al crear el codigo" })
  }
}

export const deleteJoinCodeController = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({ error: "Falta el ID del codigo" })
  }
  try {
    await deleteJoinCodeById(id)
    return res.json({ success: true })
  } catch (error) {
    console.error("Error eliminando codigo:", error)
    return res.status(500).json({ error: "Error al eliminar el codigo" })
  }
}

export const listRolesController = async (_req: Request, res: Response) => {
  try {
    const roles = await listRoles()
    return res.json({ roles })
  } catch (error) {
    console.error("Error obteniendo roles:", error)
    return res.status(500).json({ error: "Error al obtener roles" })
  }
}

// Actualiza el rol de un usuario.
export const updateUserRoleController = async (req: Request, res: Response) => {
  const { id } = req.params
  const { roleId } = req.body as { roleId?: string }

  if (!id || !roleId) {
    return res.status(400).json({ error: "Faltan datos para actualizar el rol" })
  }

  try {
    const role = await findRoleById(roleId)
    if (!role) {
      return res.status(404).json({ error: "Rol no encontrado" })
    }

    const updated = await updateUserRoleById(id, roleId)
    if (!updated) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    return res.json({
      success: true,
      user: {
        ...updated,
        role_name: role.name,
        role_scope: role.scope,
      },
    })
  } catch (error) {
    console.error("Error actualizando rol:", error)
    return res.status(500).json({ error: "Error al actualizar el rol" })
  }
}

// Crea una organizacion.
export const createOrganizationController = async (req: Request, res: Response) => {
  const { name, slug, maxDailyActivePauses } = req.body || {}
  const trimmedName = typeof name === "string" ? name.trim() : ""
  const trimmedSlug = typeof slug === "string" ? slug.trim() : ""

  if (!trimmedName) {
    return res.status(400).json({ error: "El nombre de la organizacion es obligatorio" })
  }

  const normalizedSlug = normalizeSlug(trimmedSlug || trimmedName)
  if (!normalizedSlug) {
    return res.status(400).json({ error: "El slug de la organizacion es invalido" })
  }

  try {
    let dailyLimit: number | undefined
    if (typeof maxDailyActivePauses !== "undefined") {
      const parsed = Number(maxDailyActivePauses)
      if (!Number.isFinite(parsed) || parsed < MIN_DAILY_PAUSES || parsed > MAX_DAILY_PAUSES) {
        return res.status(400).json({
          error: `El limite diario debe estar entre ${MIN_DAILY_PAUSES} y ${MAX_DAILY_PAUSES}`,
        })
      }
      dailyLimit = Math.floor(parsed)
    }

    const organization = await createOrganization(trimmedName, normalizedSlug, dailyLimit)
    return res.status(201).json({ organization })
  } catch (error: any) {
    if (error?.code === "23505") {
      return res.status(400).json({ error: "El nombre o slug ya existe" })
    }
    console.error("Error creando organizacion:", error)
    return res.status(500).json({ error: "Error al crear la organizacion" })
  }
}

// Crea un departamento.
export const createDepartmentController = async (req: Request, res: Response) => {
  const { organizationId, name } = req.body || {}
  const trimmedName = typeof name === "string" ? name.trim() : ""

  if (!organizationId || !trimmedName) {
    return res.status(400).json({ error: "Faltan organizacion o nombre del departamento" })
  }

  try {
    const org = await findOrganizationById(organizationId)
    if (!org) {
      return res.status(404).json({ error: "Organizacion no encontrada" })
    }

    const department = await createDepartment(organizationId, trimmedName)
    return res.status(201).json({ department })
  } catch (error: any) {
    if (error?.code === "23505") {
      return res.status(400).json({ error: "El departamento ya existe" })
    }
    console.error("Error creando departamento:", error)
    return res.status(500).json({ error: "Error al crear el departamento" })
  }
}

// Actualiza el limite diario de pausas de una organizacion.
export const updateOrganizationDailyLimitController = async (req: Request, res: Response) => {
  const { id } = req.params
  const { maxDailyActivePauses } = req.body || {}

  if (!id) {
    return res.status(400).json({ error: "Falta el ID de la organizacion" })
  }

  const parsed = Number(maxDailyActivePauses)
  if (!Number.isFinite(parsed) || parsed < MIN_DAILY_PAUSES || parsed > MAX_DAILY_PAUSES) {
    return res.status(400).json({
      error: `El limite diario debe estar entre ${MIN_DAILY_PAUSES} y ${MAX_DAILY_PAUSES}`,
    })
  }

  try {
    const organization = await updateOrganizationDailyLimitById(id, Math.floor(parsed))
    if (!organization) {
      return res.status(404).json({ error: "Organizacion no encontrada" })
    }
    return res.json({ organization })
  } catch (error) {
    console.error("Error actualizando limite diario:", error)
    return res.status(500).json({ error: "Error al actualizar el limite diario" })
  }
}

export const listOrganizationSeasonTimers = async (_req: Request, res: Response) => {
  try {
    const organizations = await listOrganizationSeasonTimersQuery()
    return res.json({ organizations })
  } catch (error) {
    console.error("Error listando temporizadores de temporada:", error)
    return res.status(500).json({ error: "Error al obtener temporizadores de temporada" })
  }
}

export const updateOrganizationSeasonTimer = async (req: Request, res: Response) => {
  const { organizationId } = req.params
  const { season_deadline, season_timezone } = req.body || {}

  if (!organizationId) {
    return res.status(400).json({ error: "Falta el ID de la organizacion" })
  }

  let parsedDeadline: string | null = null
  if (season_deadline) {
    const date = new Date(season_deadline)
    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({ error: "Fecha de temporada invalida" })
    }
    parsedDeadline = date.toISOString().slice(0, 10)
  }

  const timezone =
    typeof season_timezone === "string" && season_timezone.trim().length
      ? season_timezone.trim()
      : null

  try {
    const organization = await updateOrganizationSeasonTimerById(
      organizationId,
      parsedDeadline,
      timezone
    )
    if (!organization) {
      return res.status(404).json({ error: "Organizacion no encontrada" })
    }
    return res.json({ organization })
  } catch (error) {
    console.error("Error actualizando temporizador de temporada:", error)
    return res.status(500).json({ error: "Error al actualizar temporizador de temporada" })
  }
}

// Devuelve organizaciones y sus departamentos.
export const getOrganizationStructure = async (_req: Request, res: Response) => {
  try {
    const { orgs, depts } = await fetchOrganizationStructure()

    const structure = orgs.map((org) => ({
      ...org,
      departments: depts.filter((dept) => dept.organization_id === org.id),
    }))

    return res.json({ organizations: structure })
  } catch (error) {
    console.error("Error obteniendo estructura:", error)
    return res.status(500).json({ error: "Error al obtener estructura" })
  }
}

// Actualiza la membresia (organizacion/departamento) de un usuario.
export const updateUserMembershipController = async (req: Request, res: Response) => {
  const { id } = req.params
  const { organizationId, departmentId } = req.body as {
    organizationId?: string
    departmentId?: string
  }

  if (!id || !organizationId || !departmentId) {
    return res.status(400).json({ error: "Faltan organizacion o departamento" })
  }

  try {
    const org = await findOrganizationById(organizationId)
    if (!org) {
      return res.status(404).json({ error: "Organizacion no encontrada" })
    }

    const department = await findDepartmentById(departmentId)
    if (!department) {
      return res.status(404).json({ error: "Departamento no encontrado" })
    }

    if (department.organization_id !== organizationId) {
      return res
        .status(400)
        .json({ error: "El departamento no pertenece a la organizacion seleccionada" })
    }

    await upsertUserMembership(id, organizationId, departmentId)

    return res.json({
      success: true,
      membership: {
        user_id: id,
        organization_id: organizationId,
        department_id: departmentId,
        organization_name: org.name,
        department_name: department.name,
      },
    })
  } catch (error) {
    console.error("Error actualizando membership:", error)
    return res.status(500).json({ error: "Error al actualizar organizacion/departamento" })
  }
}

// Reinicio manual de datos por organizacion/departamento.
export const resetOrganizationDataController = async (req: Request, res: Response) => {
  const {
    organizationId,
    departmentId,
    resetGeneralAchievements,
    resetWeeklyAchievements,
    resetActivePauses,
    resetRanking,
  } = req.body || {}

  if (!organizationId) {
    return res.status(400).json({ error: "Falta la organizacion" })
  }

  const hasAny =
    Boolean(resetGeneralAchievements) ||
    Boolean(resetWeeklyAchievements) ||
    Boolean(resetActivePauses) ||
    Boolean(resetRanking)

  if (!hasAny) {
    return res.status(400).json({ error: "Selecciona al menos un parametro de reinicio" })
  }

  try {
    const organization = await findOrganizationById(organizationId)
    if (!organization) {
      return res.status(404).json({ error: "Organizacion no encontrada" })
    }

    if (departmentId) {
      const department = await findDepartmentById(departmentId)
      if (!department) {
        return res.status(404).json({ error: "Departamento no encontrado" })
      }
      if (department.organization_id !== organizationId) {
        return res.status(400).json({
          error: "El departamento no pertenece a la organizacion seleccionada",
        })
      }
    }

    const result = await resetOrganizationScopeData({
      organizationId,
      departmentId: departmentId ?? null,
      resetGeneralAchievements: Boolean(resetGeneralAchievements),
      resetWeeklyAchievements: Boolean(resetWeeklyAchievements),
      resetActivePauses: Boolean(resetActivePauses),
      resetRanking: Boolean(resetRanking),
    })

    return res.json({ success: true, result })
  } catch (error) {
    console.error("Error en reinicio global:", error)
    return res.status(500).json({ error: "Error al ejecutar el reinicio" })
  }
}

// Lista los valores por defecto de notificaciones por organizacion.
export const listOrganizationNotificationDefaults = async (_req: Request, res: Response) => {
  try {
    const rows = await listOrganizationNotificationDefaultsQuery()

    const organizations = rows.map((org) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      times: parsePgArray(org.default_notification_times),
      active: org.default_notification_active ?? true,
      allow_weekend_notifications: org.default_allow_weekend_notifications ?? true,
    }))

    return res.json({ organizations })
  } catch (error) {
    console.error("Error listando horarios por defecto:", error)
    return res.status(500).json({ error: "Error al obtener horarios por defecto" })
  }
}

// Actualiza los horarios y flags por defecto de notificaciones de una organizacion.
export const updateOrganizationNotificationDefaults = async (req: Request, res: Response) => {
  const { organizationId } = req.params
  const { times, active, allow_weekend_notifications } = req.body || {}

  if (!organizationId) {
    return res.status(400).json({ error: "Falta el identificador de la organizacion" })
  }

  let normalizedTimes: string[]
  try {
    normalizedTimes = normalizeTimesInput(times)
  } catch (err) {
    return res.status(400).json({
      error: err instanceof Error ? err.message : "Horarios invalidos",
    })
  }

  const activeValue = typeof active === "boolean" ? active : undefined
  const allowWeekendValue =
    typeof allow_weekend_notifications === "boolean" ? allow_weekend_notifications : undefined

  try {
    const organization = await updateOrganizationNotificationDefaultsById(
      organizationId,
      normalizedTimes,
      activeValue,
      allowWeekendValue
    )

    if (!organization) {
      return res.status(404).json({ error: "Organizacion no encontrada" })
    }

    return res.json({
      success: true,
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        times: parsePgArray(organization.default_notification_times),
        active: organization.default_notification_active ?? true,
        allow_weekend_notifications: organization.default_allow_weekend_notifications ?? true,
      },
    })
  } catch (error) {
    console.error("Error actualizando horarios por organizacion:", error)
    return res.status(500).json({ error: "Error al actualizar horarios por defecto" })
  }
}
