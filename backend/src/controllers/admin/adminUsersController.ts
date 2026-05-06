import { Request, Response } from "express"
import bcrypt from "bcrypt"
import {
  approveUserAccount,
  rejectUserAccount,
  findUserById,
  updateUserPasswordById,
} from "../../db/queries/userQueries"
import {
  deleteAdminUser,
  fetchAdminUsers,
  updateAdminUser,
  updateUserRoleById,
} from "../../db/queries/adminQueries"
import { getMembershipForUser, upsertUserMembership } from "../../db/queries/userMembershipQueries"
import { findRoleById, listRoles } from "../../db/queries/roleQueries"
import { addUserXP } from "../../db/queries/xpQueries"
import { mapAdminUserRows, isSuperAdmin, validateOrganizationDepartmentScope } from "./shared"

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
    return res.json({ users: mapAdminUserRows(rows) })
  } catch (error) {
    console.error("Error listing users:", error)
    return res.status(500).json({ error: "Error al obtener la lista de usuarios" })
  }
}

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

export const listRolesController = async (_req: Request, res: Response) => {
  try {
    const roles = await listRoles()
    return res.json({ roles })
  } catch (error) {
    console.error("Error obteniendo roles:", error)
    return res.status(500).json({ error: "Error al obtener roles" })
  }
}

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
    const { organization, department } = await validateOrganizationDepartmentScope(
      organizationId,
      departmentId
    )

    await upsertUserMembership(id, organizationId, departmentId)

    return res.json({
      success: true,
      membership: {
        user_id: id,
        organization_id: organizationId,
        department_id: departmentId,
        organization_name: organization.name,
        department_name: department?.name,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === "ORGANIZATION_NOT_FOUND") {
      return res.status(404).json({ error: "Organizacion no encontrada" })
    }
    if (error instanceof Error && error.message === "DEPARTMENT_NOT_FOUND") {
      return res.status(404).json({ error: "Departamento no encontrado" })
    }
    if (error instanceof Error && error.message === "DEPARTMENT_SCOPE_MISMATCH") {
      return res.status(400).json({
        error: "El departamento no pertenece a la organizacion seleccionada",
      })
    }

    console.error("Error actualizando membership:", error)
    return res.status(500).json({ error: "Error al actualizar organizacion/departamento" })
  }
}

const ADMIN_XP_REASONS = new Set([
  "correction",
  "bonus",
  "incident",
  "campaign",
  "manual_reward",
  "other",
])

export const addManualXpController = async (req: Request, res: Response) => {
  const { id } = req.params
  const requester = (req as any).user
  const {
    points,
    reasonKey,
    reasonLabel,
    reasonDetail,
    effectiveAt,
  } = req.body as {
    points?: number
    reasonKey?: string
    reasonLabel?: string
    reasonDetail?: string
    effectiveAt?: string
  }

  if (!id) {
    return res.status(400).json({ error: "Falta el ID del usuario" })
  }

  if (!requester?.id) {
    return res.status(401).json({ error: "No autenticado" })
  }

  if (!Number.isFinite(points) || Number(points) <= 0) {
    return res.status(400).json({ error: "Los puntos deben ser un numero positivo" })
  }

  const normalizedPoints = Math.floor(Number(points))
  if (normalizedPoints <= 0) {
    return res.status(400).json({ error: "Los puntos deben ser un entero positivo" })
  }

  const normalizedReasonKey =
    typeof reasonKey === "string" && ADMIN_XP_REASONS.has(reasonKey.trim())
      ? reasonKey.trim()
      : "other"

  const normalizedReasonLabel =
    typeof reasonLabel === "string" && reasonLabel.trim().length
      ? reasonLabel.trim().slice(0, 120)
      : "Ajuste manual"

  const normalizedReasonDetail =
    typeof reasonDetail === "string" && reasonDetail.trim().length
      ? reasonDetail.trim().slice(0, 500)
      : null

  let createdAt: string | undefined
  if (typeof effectiveAt === "string" && effectiveAt.trim().length) {
    const parsed = new Date(effectiveAt)
    if (Number.isNaN(parsed.getTime())) {
      return res.status(400).json({ error: "La fecha indicada no es valida" })
    }
    createdAt = parsed.toISOString()
  }

  try {
    const targetUser = await findUserById(id)
    if (!targetUser) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    const result = await addUserXP(
      id,
      normalizedPoints,
      {
        source: "admin_adjustment",
        reason_key: normalizedReasonKey,
        reason_label: normalizedReasonLabel,
        reason_detail: normalizedReasonDetail,
        granted_by_user_id: requester.id,
        granted_at: new Date().toISOString(),
      },
      createdAt ? { createdAt } : undefined
    )

    if (!result) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    return res.json({
      success: true,
      user_id: result.id,
      new_exp_total: result.exp,
      added_points: result.added_points ?? normalizedPoints,
    })
  } catch (error) {
    console.error("Error asignando XP manual:", error)
    return res.status(500).json({ error: "Error al asignar XP manual" })
  }
}
