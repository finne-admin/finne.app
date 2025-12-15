import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { getPool } from "../config/dbManager";
import {
  approveUserAccount,
  rejectUserAccount,
  updateUserPasswordById,
} from "../db/queries/userQueries";
import {
  fetchAdminUsers,
  updateAdminUser,
  deleteAdminUser,
  fetchExerciseSatisfactionRecords,
} from "../db/queries/adminQueries";
import {
  createJoinCode as createJoinCodeQuery,
  deleteJoinCodeById,
  listJoinCodes,
  findJoinCodeByCode,
} from "../db/queries/joinCodeQueries";
import { getMembershipForUser, upsertUserMembership } from "../db/queries/userMembershipQueries";
import { findRoleById, listRoles } from "../db/queries/roleQueries";

const parsePgArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value as string[];
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
      return [trimmed];
    }
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item) => item.replace(/(^"|"$)/g, "").trim())
      .filter(Boolean);
  }
  return [];
};

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const normalizeTimesInput = (value: unknown): string[] => {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("Debes proporcionar al menos un horario");
  }

  const normalized = (value as unknown[]).map((item) => {
    if (typeof item !== "string") {
      throw new Error("Los horarios deben ser cadenas en formato HH:MM");
    }
    const trimmed = item.trim();
    if (!TIME_REGEX.test(trimmed)) {
      throw new Error(`Formato inválido para el horario ${trimmed}`);
    }
    return trimmed;
  });

  const unique = Array.from(new Set(normalized));
  unique.sort();
  return unique;
};

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
  }));

const isSuperAdmin = (user?: any) =>
  user?.roleName?.toLowerCase() === "superadmin" || user?.roleScope === "global";

export const listUsers = async (req: Request, res: Response) => {
  try {
    const requester = (req as any).user;
    if (!requester) {
      return res.status(401).json({ error: "No autenticado" });
    }

    const scope =
      typeof req.query.scope === "string" ? req.query.scope.toLowerCase() : "organization";

    const requestedOrg =
      typeof req.query.organizationId === "string" ? req.query.organizationId : undefined;
    const requestedDept =
      typeof req.query.departmentId === "string" ? req.query.departmentId : undefined;

    const filters: { organizationId?: string; departmentId?: string } = {};

    const allowGlobal = scope === "global" && isSuperAdmin(requester);

    if (allowGlobal) {
      if (requestedOrg) filters.organizationId = requestedOrg;
      if (requestedDept) filters.departmentId = requestedDept;
    } else {
      const membership = await getMembershipForUser(requester.id);
      if (!membership?.organization_id) {
        return res
          .status(403)
          .json({ error: "Tu cuenta no está asociada a ninguna organización" });
      }
      filters.organizationId = membership.organization_id;
      if (requestedDept) {
        filters.departmentId = requestedDept;
      }
    }

    const rows = await fetchAdminUsers(filters);
    return res.json({ users: mapUserRows(rows) });
  } catch (error) {
    console.error("Error listing users:", error);
    return res.status(500).json({ error: "Error al obtener la lista de usuarios" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { first_name, last_name, email } = req.body || {};

  if (!id) {
    return res.status(400).json({ error: "Falta el ID del usuario" });
  }

  try {
    const updatedUser = await updateAdminUser({ id, first_name, last_name, email });
    if (!updatedUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json({ user: updatedUser });
  } catch (error: any) {
    if (error?.code === "23505") {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Falta el ID del usuario" });
  }

  try {
    const deleted = await deleteAdminUser(id);
    if (deleted === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};

export const changeUserPassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { newPassword } = req.body as { newPassword?: string };

  if (!id) {
    return res.status(400).json({ error: "Falta el ID del usuario" });
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: "La nueva contraseña debe tener al menos 6 caracteres" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPasswordById(id, hashedPassword);
    return res.json({ success: true });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ error: "Error al actualizar la contraseña" });
  }
};

export const approveUserRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const adminId = (req as any).user?.id as string | undefined;

  if (!id) {
    return res.status(400).json({ error: "Falta el ID del usuario" });
  }

  if (!adminId) {
    return res.status(401).json({ error: "No autenticado" });
  }

  try {
    const updated = await approveUserAccount(id, adminId);
    if (!updated) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json({ success: true, user: updated });
  } catch (error) {
    console.error("Error approving user:", error);
    return res.status(500).json({ error: "Error al aprobar la solicitud" });
  }
};

export const rejectUserRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const adminId = (req as any).user?.id as string | undefined;

  if (!id) {
    return res.status(400).json({ error: "Falta el ID del usuario" });
  }

  if (!adminId) {
    return res.status(401).json({ error: "No autenticado" });
  }

  try {
    const updated = await rejectUserAccount(id, adminId);
    if (!updated) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json({ success: true, user: updated });
  } catch (error) {
    console.error("Error rejecting user:", error);
    return res.status(500).json({ error: "Error al rechazar la solicitud" });
  }
};

export const getExerciseSatisfaction = async (req: Request, res: Response) => {
  const limitParam = req.query.limit ? parseInt(String(req.query.limit), 10) : 1000;
  const limit = Number.isNaN(limitParam) ? 1000 : Math.min(Math.max(limitParam, 1), 5000);

  try {
    const rows = await fetchExerciseSatisfactionRecords(limit);

    const normalized = rows.map((row) => ({
      ...row,
      video_hash_ids: parsePgArray(row.video_hash_ids),
      tags: parsePgArray(row.tags),
      created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
    }));

    return res.json({ records: normalized });
  } catch (error) {
    console.error("Error fetching exercise satisfaction data:", error);
    return res.status(500).json({ error: "Error al obtener datos de ejercicios" });
  }
};

const randomSegment = () =>
  Math.random().toString(36).replace(/[^a-z0-9]+/gi, "").toUpperCase().slice(0, 3);

const generateJoinCodeValue = () => `${randomSegment()}-${randomSegment()}`;

const normalizeCodeInput = (value: string) => value.trim().toUpperCase();

export const listJoinCodesController = async (_req: Request, res: Response) => {
  try {
    const codes = await listJoinCodes();
    return res.json({ codes });
  } catch (error) {
    console.error("Error listando códigos:", error);
    return res.status(500).json({ error: "Error al obtener códigos" });
  }
};

export const createJoinCodeController = async (req: Request, res: Response) => {
  const { organizationId, departmentId, expiresAt, maxUses, autoApprove, code } = req.body || {};
  if (!organizationId || !departmentId) {
    return res.status(400).json({ error: "Faltan organización o departamento" });
  }

  try {
    const pool = await getPool();
    const orgResult = await pool.query(
      `SELECT id, name FROM organizations WHERE id = $1`,
      [organizationId]
    );
    if (!orgResult.rowCount) {
      return res.status(404).json({ error: "Organización no encontrada" });
    }

    const deptResult = await pool.query(
      `SELECT id, name, organization_id FROM departments WHERE id = $1`,
      [departmentId]
    );
    const department = deptResult.rows[0];
    if (!department) {
      return res.status(404).json({ error: "Departamento no encontrado" });
    }

    if (department.organization_id !== organizationId) {
      return res
        .status(400)
        .json({ error: "El departamento no pertenece a la organización seleccionada" });
    }

    const normalizedCode = code ? normalizeCodeInput(code) : generateJoinCodeValue();

    if (!/^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(normalizedCode)) {
      return res.status(400).json({ error: "El código debe tener formato XXX-YYY" });
    }

    const parsedMaxUses =
      typeof maxUses === "number" && maxUses > 0 ? Math.floor(maxUses) : null;

    let parsedExpiresAt: Date | null = null;
    if (expiresAt) {
      const date = new Date(expiresAt);
      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({ error: "Fecha de expiración inválida" });
      }
      parsedExpiresAt = date;
    }

    const createdBy = (req as any).user?.id ?? null;

    await createJoinCodeQuery({
      organizationId,
      departmentId,
      code: normalizedCode,
      autoApprove: Boolean(autoApprove),
      maxUses: parsedMaxUses,
      expiresAt: parsedExpiresAt || null,
      createdBy,
    });

    const record = await findJoinCodeByCode(normalizedCode);
    return res.status(201).json({ code: record });
  } catch (error: any) {
    if (error?.code === "23505") {
      return res.status(400).json({ error: "El código ya está en uso" });
    }
    console.error("Error creando código:", error);
    return res.status(500).json({ error: "Error al crear el código" });
  }
};

export const deleteJoinCodeController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Falta el ID del código" });
  }
  try {
    await deleteJoinCodeById(id);
    return res.json({ success: true });
  } catch (error) {
    console.error("Error eliminando código:", error);
    return res.status(500).json({ error: "Error al eliminar el código" });
  }
};

export const listRolesController = async (_req: Request, res: Response) => {
  try {
    const roles = await listRoles();
    return res.json({ roles });
  } catch (error) {
    console.error("Error obteniendo roles:", error);
    return res.status(500).json({ error: "Error al obtener roles" });
  }
};

export const updateUserRoleController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { roleId } = req.body as { roleId?: string };

  if (!id || !roleId) {
    return res.status(400).json({ error: "Faltan datos para actualizar el rol" });
  }

  try {
    const role = await findRoleById(roleId);
    if (!role) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }

    const pool = await getPool();
    const { rows } = await pool.query(
      `
      UPDATE users
      SET role_id = $2,
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, first_name, last_name, role_id
      `,
      [id, roleId]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json({
      success: true,
      user: {
        ...rows[0],
        role_name: role.name,
        role_scope: role.scope,
      },
    });
  } catch (error) {
    console.error("Error actualizando rol:", error);
    return res.status(500).json({ error: "Error al actualizar el rol" });
  }
};

export const getOrganizationStructure = async (_req: Request, res: Response) => {
  try {
    const pool = await getPool();
    const { rows: orgs } = await pool.query(
      `SELECT id, name, slug FROM organizations ORDER BY name`
    );
    const { rows: depts } = await pool.query(
      `SELECT id, name, organization_id FROM departments ORDER BY name`
    );

    const structure = orgs.map((org) => ({
      ...org,
      departments: depts.filter((dept) => dept.organization_id === org.id),
    }));

    return res.json({ organizations: structure });
  } catch (error) {
    console.error("Error obteniendo estructura:", error);
    return res.status(500).json({ error: "Error al obtener estructura" });
  }
};

export const updateUserMembershipController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { organizationId, departmentId } = req.body as {
    organizationId?: string;
    departmentId?: string;
  };

  if (!id || !organizationId || !departmentId) {
    return res.status(400).json({ error: "Faltan organización o departamento" });
  }

  try {
    const pool = await getPool();
    const org = await pool.query(`SELECT id, name FROM organizations WHERE id = $1`, [
      organizationId,
    ]);
    if (!org.rowCount) {
      return res.status(404).json({ error: "Organización no encontrada" });
    }

    const dept = await pool.query(
      `SELECT id, name, organization_id FROM departments WHERE id = $1`,
      [departmentId]
    );
    const department = dept.rows[0];
    if (!department) {
      return res.status(404).json({ error: "Departamento no encontrado" });
    }

    if (department.organization_id !== organizationId) {
      return res
        .status(400)
        .json({ error: "El departamento no pertenece a la organización seleccionada" });
    }

    await upsertUserMembership(id, organizationId, departmentId);

    return res.json({
      success: true,
      membership: {
        user_id: id,
        organization_id: organizationId,
        department_id: departmentId,
        organization_name: org.rows[0].name,
        department_name: department.name,
      },
    });
  } catch (error) {
    console.error("Error actualizando membership:", error);
    return res.status(500).json({ error: "Error al actualizar organización/departamento" });
  }
};

export const listOrganizationNotificationDefaults = async (_req: Request, res: Response) => {
  try {
    const pool = await getPool();
    const { rows } = await pool.query(
      `
      SELECT
        id,
        name,
        slug,
        default_notification_times,
        default_notification_active,
        default_allow_weekend_notifications
      FROM organizations
      ORDER BY name
      `
    );

    const organizations = rows.map((org) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      times: parsePgArray(org.default_notification_times),
      active: org.default_notification_active ?? true,
      allow_weekend_notifications: org.default_allow_weekend_notifications ?? true,
    }));

    return res.json({ organizations });
  } catch (error) {
    console.error("Error listando horarios por defecto:", error);
    return res.status(500).json({ error: "Error al obtener horarios por defecto" });
  }
};

export const updateOrganizationNotificationDefaults = async (req: Request, res: Response) => {
  const { organizationId } = req.params;
  const { times, active, allow_weekend_notifications } = req.body || {};

  if (!organizationId) {
    return res.status(400).json({ error: "Falta el identificador de la organización" });
  }

  let normalizedTimes: string[];
  try {
    normalizedTimes = normalizeTimesInput(times);
  } catch (err) {
    return res.status(400).json({
      error: err instanceof Error ? err.message : "Horarios inválidos",
    });
  }

  const activeValue = typeof active === "boolean" ? active : undefined;
  const allowWeekendValue =
    typeof allow_weekend_notifications === "boolean" ? allow_weekend_notifications : undefined;

  try {
    const pool = await getPool();
    const { rows } = await pool.query(
      `
      UPDATE organizations
      SET
        default_notification_times = $2::text[],
        default_notification_active = COALESCE($3, default_notification_active),
        default_allow_weekend_notifications = COALESCE($4, default_allow_weekend_notifications)
      WHERE id = $1
      RETURNING
        id,
        name,
        slug,
        default_notification_times,
        default_notification_active,
        default_allow_weekend_notifications
      `,
      [organizationId, normalizedTimes, activeValue, allowWeekendValue]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: "Organización no encontrada" });
    }

    const organization = rows[0];
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
    });
  } catch (error) {
    console.error("Error actualizando horarios por organización:", error);
    return res.status(500).json({ error: "Error al actualizar horarios por defecto" });
  }
};


