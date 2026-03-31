import { Request, Response } from "express"
import {
  createJoinCode as createJoinCodeQuery,
  deleteJoinCodeById,
  findJoinCodeByCode,
  listJoinCodes,
} from "../../db/queries/joinCodeQueries"
import { validateOrganizationDepartmentScope } from "./shared"

const randomSegment = () =>
  Math.random().toString(36).replace(/[^a-z0-9]+/gi, "").toUpperCase().slice(0, 3)

const generateJoinCodeValue = () => `${randomSegment()}-${randomSegment()}`
const normalizeCodeInput = (value: string) => value.trim().toUpperCase()

export const listJoinCodesController = async (_req: Request, res: Response) => {
  try {
    const codes = await listJoinCodes()
    return res.json({ codes })
  } catch (error) {
    console.error("Error listando codigos:", error)
    return res.status(500).json({ error: "Error al obtener codigos" })
  }
}

export const createJoinCodeController = async (req: Request, res: Response) => {
  const { organizationId, departmentId, expiresAt, maxUses, autoApprove, code } = req.body || {}
  if (!organizationId || !departmentId) {
    return res.status(400).json({ error: "Faltan organizacion o departamento" })
  }

  try {
    await validateOrganizationDepartmentScope(organizationId, departmentId)

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
