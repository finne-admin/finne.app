"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye, Pencil, Trash2, Search, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { apiGet, apiFetch, API_BASE_URL } from "@/lib/apiClient"

const SkeletonRow = () => (
  <TableRow className="animate-pulse">
    <TableCell>
      <div className="h-4 w-4 bg-gray-200 rounded" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-32 bg-gray-200 rounded" />
    </TableCell>
    <TableCell className="hidden sm:table-cell">
      <div className="h-4 w-48 bg-gray-200 rounded" />
    </TableCell>
    <TableCell className="hidden md:table-cell">
      <div className="h-4 w-20 bg-gray-200 rounded" />
    </TableCell>
    <TableCell className="hidden lg:table-cell">
      <div className="h-6 w-16 bg-gray-200 rounded-full" />
    </TableCell>
    <TableCell>
      <div className="flex gap-2">
        <div className="h-8 w-8 bg-gray-200 rounded" />
        <div className="h-8 w-8 bg-gray-200 rounded" />
        <div className="h-8 w-8 bg-gray-200 rounded" />
      </div>
    </TableCell>
  </TableRow>
)

interface Employee {
  id: string
  email: string
  first_name: string
  last_name: string
  role_id?: string | null
  role?: string | null
  role_name?: string | null
  role_scope?: string | null
  created_at: string
  last_active: string | null
  is_active: boolean
  account_status: "pending" | "active" | "rejected"
  registration_requested_at: string | null
  approved_at: string | null
  approved_by: string | null
  organization_id?: string | null
  department_id?: string | null
  organization_name?: string | null
  department_name?: string | null
  new_password?: string
}

interface UserStatsSummary {
  total_exercises: number
  distinct_days: number
  weekly_sessions: number
  avg_satisfaction: number
}

interface UserStatsResponse {
  summary: UserStatsSummary
  category_distribution: { category: string; total_sessions: number }[]
  activity_timeline: { day: string; sessions: number }[]
  weekly_pattern: { day_of_week: string; sessions: number }[]
  hourly_pattern: { time_slot: string; sessions: number }[]
  insights: string[]
  favorite_videos: { title: string; wistia_id: string | null; total_sessions: number }[]
  weekly_comparison: { week_start: string; sessions: number }[]
  time_summary: { week_minutes: number; month_minutes: number }
  weeklyActiveDays?: number[]
  xpHistory?: XpLog[]
}

const ACCOUNT_STATUS_META: Record<
  Employee["account_status"],
  { label: string; badgeClass: string; rowAccentClass: string; cardBorderClass: string }
> = {
  pending: {
    label: "Pendiente",
    badgeClass: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    rowAccentClass:
      "relative bg-yellow-50/40 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-yellow-300/80",
    cardBorderClass: "border-yellow-300",
  },
  active: {
    label: "Activo",
    badgeClass: "bg-green-100 text-green-800 border border-green-200",
    rowAccentClass:
      "<border-l-5></border-l-5> border-green-300/80 bg-green-50/40",
      // relative bg-green-50/40 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-green-400/80
    cardBorderClass: "border-green-300",
  },
  rejected: {
    label: "Rechazado",
    badgeClass: "bg-red-100 text-red-800 border border-red-200",
    rowAccentClass:
      "relative bg-red-50/40 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-red-300/80",
    cardBorderClass: "border-red-300",
  },
}

const formatDateTime = (value?: string | null) => {
  if (!value) return "-"
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

const formatMinutes = (minutes?: number | null) => {
  if (!minutes) return "0 min"
  if (minutes < 60) return `${minutes.toFixed(0)} min`
  const hours = minutes / 60
  return `${hours.toFixed(1)} h`
}

type XpLog = {
  id: string
  points: number
  action_type?: string | null
  created_at?: string | null
  metadata?: Record<string, any> | null
}

const XP_SOURCE_LABELS: Record<string, string> = {
  active_pause: "Pausa activa",
  pause: "Pausa activa",
  achievement: "Logro",
  weekly_challenge: "Reto semanal",
  questionnaire: "Cuestionario",
  xp_gain: "XP",
}

const resolveXpLabel = (entry: XpLog) => {
  const meta = entry.metadata ?? {}
  const source = (meta.source || entry.action_type || "xp_gain") as string
  return XP_SOURCE_LABELS[source] ?? "XP"
}

const formatXpDate = (value?: string | null) => {
  if (!value) return ""
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ""
  return parsed.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
  })
}

type EmployeeTableMode = "organization" | "global"

interface EmployeeTableProps {
  mode?: EmployeeTableMode
}

interface OrganizationOption {
  id: string
  name: string
  slug: string
  departments: { id: string; name: string; organization_id: string }[]
}

interface RoleOption {
  id: string
  name: string
  scope: string
}

export function EmployeeTable({ mode = "organization" }: EmployeeTableProps) {
  const [employees, setEmployees] = React.useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = React.useState<Employee[]>([])
  const [loading, setLoading] = React.useState(true)
  const [tableError, setTableError] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("")
  const [roleFilter, setRoleFilter] = React.useState<string>("")
  const [selectedEmployees, setSelectedEmployees] = React.useState<Set<string>>(new Set())
  const [departmentFilter, setDepartmentFilter] = React.useState<string>("")
  const [editUser, setEditUser] = React.useState<Employee | null>(null)
  const [editLoading, setEditLoading] = React.useState(false)
  const [editError, setEditError] = React.useState("")
  const [editSuccess, setEditSuccess] = React.useState("")
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null)
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = React.useState(false)
  const [accountActionLoading, setAccountActionLoading] = React.useState<string | null>(null)
  const [organizations, setOrganizations] = React.useState<OrganizationOption[]>([])
  const [selectedOrganization, setSelectedOrganization] = React.useState<string>("")
  const [selectedDepartment, setSelectedDepartment] = React.useState<string>("")
  const showOrgColumns = mode === "global"
  const columnCount = showOrgColumns ? 8 : 6
  const [roles, setRoles] = React.useState<RoleOption[]>([])
  const [roleLoadingId, setRoleLoadingId] = React.useState<string | null>(null)
  const [membershipLoadingId, setMembershipLoadingId] = React.useState<string | null>(null)
  const [statsModal, setStatsModal] = React.useState<{
    employee: Employee
    loading: boolean
    error: string
    data: UserStatsResponse | null
  } | null>(null)
  const availableDepartments = React.useMemo(() => {
    if (!selectedOrganization) return []
    return organizations.find((org) => org.id === selectedOrganization)?.departments ?? []
  }, [organizations, selectedOrganization])
  const roleFilterOptions =
    mode === "global" && roles.length
      ? roles.map((role) => ({
          value: role.name.toLowerCase(),
          label: role.name,
        }))
      : DEFAULT_ROLE_FILTERS

  React.useEffect(() => {
    if (mode !== "global") return

    const loadStructure = async () => {
      try {
        const res = await apiGet("/api/admin/org-structure")
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || "Error al obtener organizaciones")
        }
        const orgs: OrganizationOption[] = Array.isArray(data.organizations)
          ? (data.organizations as OrganizationOption[]).map((org) => ({
              ...org,
              departments: Array.isArray(org.departments) ? org.departments : [],
            }))
          : []
        setOrganizations(orgs)
        setSelectedOrganization((current) => {
          if (current && !orgs.some((org) => org.id === current)) {
            setSelectedDepartment("")
            return ""
          }
          return current
        })
      } catch (err) {
        console.error("Error al obtener organizaciones:", err)
      }
    }

    loadStructure()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  React.useEffect(() => {
    if (mode !== "global") return
    const fetchRoles = async () => {
      try {
        const res = await apiGet("/api/admin/roles")
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || "Error al obtener roles")
        }
        const serverRoles = Array.isArray(data.roles) ? data.roles : []
        setRoles(serverRoles)
      } catch (error) {
        console.error("Error al obtener roles:", error)
      }
    }
    fetchRoles()
  }, [mode])

  React.useEffect(() => {
    if (mode !== "global" || !selectedOrganization) {
      if (mode !== "global" && selectedDepartment) {
        setSelectedDepartment("")
      }
      return
    }

    if (!availableDepartments.find((dept) => dept.id === selectedDepartment)) {
      setSelectedDepartment("")
    }
  }, [availableDepartments, mode, selectedDepartment, selectedOrganization])

  const itemsPerPage = 5

  const departmentFilterOptions = React.useMemo(() => {
    const entries = new Map<string, string>()
    employees.forEach((emp) => {
      const key = emp.department_id || emp.department_name || ""
      const label = emp.department_name || "Departamento sin nombre"
      if (key) {
        entries.set(key, label)
      }
    })
    return Array.from(entries.entries()).map(([value, label]) => ({ value, label }))
  }, [employees])

  const fetchEmployees = React.useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false
      if (!silent) {
        setLoading(true)
      }
      setTableError("")
      try {
        const params = new URLSearchParams()
        params.append("scope", mode === "global" ? "global" : "organization")

        if (mode === "global") {
          if (selectedOrganization) params.append("organizationId", selectedOrganization)
          if (selectedDepartment) params.append("departmentId", selectedDepartment)
        }

        const query = params.toString()
        const res = await apiGet(`/api/admin/users${query ? `?${query}` : ""}`)
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || "Error al obtener empleados")
        }
        const users: Employee[] = Array.isArray(data.users) ? data.users : []
        setEmployees(users)
      } catch (error) {
        console.error("Error al obtener empleados:", error)
        setTableError(error instanceof Error ? error.message : "Error al obtener empleados")
      } finally {
        if (!silent) {
          setLoading(false)
        }
      }
    },
    [mode, selectedDepartment, selectedOrganization]
  )

  React.useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  React.useEffect(() => {
    let filtered = [...employees]

    if (searchTerm) {
      const query = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (emp) =>
          emp.email.toLowerCase().includes(query) ||
          `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(query)
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((emp) => emp.account_status === statusFilter)
    }

    if (roleFilter) {
      filtered = filtered.filter((emp) => {
        const roleName = (emp.role_name || emp.role || "").toLowerCase()
        return roleName === roleFilter
      })
    }

    if (departmentFilter) {
      filtered = filtered.filter((emp) => {
        const key = emp.department_id || emp.department_name || ""
        return key === departmentFilter
      })
    }

    setFilteredEmployees(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, roleFilter, departmentFilter, employees])

  React.useEffect(() => {
    setSelectedEmployees((prev) => {
      const existingIds = new Set(employees.map((emp) => emp.id))
      const next = new Set<string>()
      prev.forEach((id) => {
        if (existingIds.has(id)) {
          next.add(id)
        }
      })
      return next
    })
  }, [employees])

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / itemsPerPage) || 1)
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(new Set(paginatedEmployees.map((emp) => emp.id)))
    } else {
      setSelectedEmployees((prev) => {
        const next = new Set(prev)
        paginatedEmployees.forEach((emp) => next.delete(emp.id))
        return next
      })
    }
  }

  const handleSelectEmployee = (empId: string, checked: boolean) => {
    setSelectedEmployees((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(empId)
      } else {
        next.delete(empId)
      }
      return next
    })
  }

  const openStatsModal = React.useCallback((employee: Employee) => {
    setStatsModal({ employee, loading: true, error: "", data: null })
    const loadStats = async () => {
      try {
        const res = await apiGet(`/api/statistics/users/${employee.id}`)
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data?.error || "Error al obtener estadísticas")
        }
        setStatsModal({ employee, loading: false, error: "", data })
      } catch (error) {
        setStatsModal((prev) => {
          if (!prev || prev.employee.id !== employee.id) return prev
          return {
            ...prev,
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "No se pudieron cargar las estadísticas",
          }
        })
      }
    }
    loadStats().catch(() => {})
  }, [])

  const handleDelete = async (empId: string) => {
    try {
      setTableError("")
      const res = await apiFetch(`${API_BASE_URL}/api/admin/users/${empId}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Error al eliminar usuario")
      }
      setEmployees((prev) => prev.filter((emp) => emp.id !== empId))
    } catch (error) {
      console.error("Error al eliminar empleado:", error)
      setTableError(error instanceof Error ? error.message : "Error al eliminar empleado")
    }
  }

  const handleBulkDelete = async () => {
    try {
      setTableError("")
      for (const empId of selectedEmployees) {
        const res = await apiFetch(`${API_BASE_URL}/api/admin/users/${empId}`, {
          method: "DELETE",
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || "Error al eliminar usuario")
        }
      }
      setEmployees((prev) => prev.filter((emp) => !selectedEmployees.has(emp.id)))
      setSelectedEmployees(new Set())
    } catch (error) {
      console.error("Error al eliminar empleados:", error)
      setTableError(error instanceof Error ? error.message : "Error al eliminar empleados")
    }
  }

  const handleAccountStatusChange = async (empId: string, action: "approve" | "reject") => {
    const actionLabel = action === "approve" ? "aprobar" : "rechazar"
    try {
      setTableError("")
      setAccountActionLoading(`${action}:${empId}`)
      const res = await apiFetch(`${API_BASE_URL}/api/admin/users/${empId}/${action}`, {
        method: "POST",
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || `Error al ${actionLabel} usuario`)
      }
      await fetchEmployees({ silent: true })
    } catch (error) {
      console.error("Error al actualizar estado de cuenta:", error)
      setTableError(
        error instanceof Error
          ? error.message
          : `Error al ${actionLabel} usuario`
      )
    } finally {
      setAccountActionLoading(null)
    }
  }

  const handleRoleChange = async (empId: string, roleId: string) => {
    if (!roleId) return
    try {
      setRoleLoadingId(empId)
      setTableError("")
      const res = await apiFetch(`${API_BASE_URL}/api/admin/users/${empId}/role`, {
        method: "PUT",
        body: JSON.stringify({ roleId }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Error al actualizar el rol")
      }

      const selectedRole = roles.find((role) => role.id === roleId)
      const roleName = selectedRole?.name || null
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === empId
            ? {
                ...emp,
                role_id: roleId,
                role_name: roleName ?? emp.role_name,
                role_scope: selectedRole?.scope ?? emp.role_scope,
              }
            : emp
        )
      )
    } catch (error) {
      console.error("Error al actualizar rol:", error)
      setTableError(error instanceof Error ? error.message : "Error al actualizar rol")
    } finally {
      setRoleLoadingId(null)
    }
  }

  const updateMembership = async (
    empId: string,
    organizationId: string,
    departmentId: string
  ) => {
    if (!organizationId || !departmentId) {
      setTableError("Debe seleccionar organización y departamento")
      return
    }

    try {
      setMembershipLoadingId(empId)
      setTableError("")
      const res = await apiFetch(`${API_BASE_URL}/api/admin/users/${empId}/membership`, {
        method: "PUT",
        body: JSON.stringify({ organizationId, departmentId }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Error al actualizar organización")
      }

      const org = organizations.find((o) => o.id === organizationId)
      const dept = org?.departments.find((d) => d.id === departmentId)

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === empId
            ? {
                ...emp,
                organization_id: organizationId,
                department_id: departmentId,
                organization_name: org?.name ?? emp.organization_name,
                department_name: dept?.name ?? emp.department_name,
              }
            : emp
        )
      )
    } catch (error) {
      console.error("Error al actualizar organización:", error)
      setTableError(error instanceof Error ? error.message : "Error al actualizar organización")
    } finally {
      setMembershipLoadingId(null)
    }
  }

  const handleOrganizationSelect = async (employee: Employee, organizationId: string) => {
    const org = organizations.find((o) => o.id === organizationId)
    const firstDept = org?.departments?.[0]?.id
    const deptId = firstDept || ""

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employee.id
          ? {
              ...emp,
              organization_id: organizationId,
              organization_name: org?.name ?? emp.organization_name,
              department_id: deptId,
              department_name:
                org?.departments.find((d) => d.id === deptId)?.name || emp.department_name,
            }
          : emp
      )
    )

    if (deptId) {
      await updateMembership(employee.id, organizationId, deptId)
    } else {
      setTableError("La organización seleccionada no tiene departamentos configurados.")
    }
  }

  const handleDepartmentSelect = async (employee: Employee, departmentId: string) => {
    if (!employee.organization_id) {
      setTableError("Selecciona una organización primero.")
      return
    }

    const org = organizations.find((o) => o.id === employee.organization_id)
    const deptName = org?.departments.find((d) => d.id === departmentId)?.name

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employee.id
          ? {
              ...emp,
              department_id: departmentId,
              department_name: deptName ?? emp.department_name,
            }
          : emp
      )
    )

    await updateMembership(employee.id, employee.organization_id, departmentId)
  }

  const handleSaveEdit = async () => {
    if (!editUser) return

    if (!editUser.first_name || !editUser.last_name || !editUser.email) {
      setEditError("Todos los campos son obligatorios")
      return
    }

    try {
      setEditLoading(true)
      setEditError("")
      setEditSuccess("")

      const res = await apiFetch(`${API_BASE_URL}/api/admin/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: editUser.first_name,
          last_name: editUser.last_name,
          email: editUser.email,
        }),
      })

      const updateData = await res.json()
      if (!res.ok) {
        throw new Error(updateData.error || "Error al actualizar usuario")
      }

      if (editUser.new_password && editUser.new_password.length >= 6) {
        const passwordRes = await apiFetch(
          `${API_BASE_URL}/api/admin/users/${editUser.id}/password`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newPassword: editUser.new_password }),
          }
        )
        const passwordData = await passwordRes.json()
        if (!passwordRes.ok) {
          throw new Error(passwordData.error || "Error al cambiar contraseña")
        }
      }

      await fetchEmployees({ silent: true })

      setEditSuccess("Cambios guardados correctamente")
      setTimeout(() => {
        setEditUser(null)
        setEditSuccess("")
      }, 1500)
    } catch (error) {
      console.error("Error al guardar cambios:", error)
      setEditError(error instanceof Error ? error.message : "Error desconocido al guardar los cambios")
    } finally {
      setEditLoading(false)
    }
  }

  const headerCheckboxChecked =
    paginatedEmployees.length > 0 &&
    paginatedEmployees.every((emp) => selectedEmployees.has(emp.id))

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por nombre o email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row md:w-auto">
          <Select
            value={statusFilter || "default"}
            onValueChange={(value) => setStatusFilter(value === "default" ? "" : value)}
          >
            <SelectTrigger className="w-full sm:w-[200px] md:w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Todos los Estados</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="active">Aprobado</SelectItem>
              <SelectItem value="rejected">Rechazado</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={roleFilter || "default"}
            onValueChange={(value) => setRoleFilter(value === "default" ? "" : value)}
          >
            <SelectTrigger className="w-full sm:w-[200px] md:w-[180px]">
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Todos los Roles</SelectItem>
              {roleFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={departmentFilter || "default"}
            onValueChange={(value) => setDepartmentFilter(value === "default" ? "" : value)}
            disabled={departmentFilterOptions.length === 0}
          >
            <SelectTrigger className="w-full sm:w-[200px] md:w-[190px]">
              <SelectValue placeholder="Departamento (vista)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Todos los departamentos</SelectItem>
              {departmentFilterOptions.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {mode === "global" && (
            <>
              <Select
                value={selectedOrganization || "default"}
                onValueChange={(value) => {
                  if (value === "default") {
                    setSelectedOrganization("")
                    setSelectedDepartment("")
                  } else {
                    setSelectedOrganization(value)
                    const firstDept =
                      organizations.find((org) => org.id === value)?.departments?.[0]?.id ?? ""
                    setSelectedDepartment(firstDept)
                  }
                }}
              >
                <SelectTrigger className="w-full sm:w-[220px]">
                  <SelectValue placeholder="Organización" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Todas las organizaciones</SelectItem>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedDepartment || "default"}
                onValueChange={(value) => setSelectedDepartment(value === "default" ? "" : value)}
                disabled={!selectedOrganization || availableDepartments.length === 0}
              >
                <SelectTrigger className="w-full sm:w-[220px]">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Todos los departamentos</SelectItem>
                  {availableDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>

        {selectedEmployees.size > 0 && (
          <div className="md:ml-auto">
            <Button
              variant="colorRed"
              onClick={() => setShowBulkDeleteConfirm(true)}
              className="whitespace-nowrap"
            >
              Eliminar Seleccionados ({selectedEmployees.size})
            </Button>
          </div>
        )}
      </div>

      {tableError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {tableError}
        </div>
      )}

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-sm text-gray-600">
              <TableHead className="w-8 px-0 text-center">
                <Checkbox
                  checked={headerCheckboxChecked}
                  onCheckedChange={(value) => handleSelectAll(value === true)}
                  disabled={paginatedEmployees.length === 0}
                />
              </TableHead>
              <TableHead className="min-w-[220px] pl-0">Empleado / Email</TableHead>
              <TableHead className="min-w-[120px]">Rol</TableHead>
              {showOrgColumns && (
                <>
                  <TableHead className="min-w-[160px]">Organización</TableHead>
                  <TableHead className="min-w-[160px]">Departamento</TableHead>
                </>
              )}
              <TableHead className="min-w-[130px] text-center">Estado</TableHead>
              <TableHead className="min-w-[140px] text-center">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array(itemsPerPage)
                  .fill(null)
                  .map((_, index) => <SkeletonRow key={index} />)
              : paginatedEmployees.map((employee) => {
                  const approving = accountActionLoading === `approve:${employee.id}`
                  const rejecting = accountActionLoading === `reject:${employee.id}`
                  const membershipUpdating = membershipLoadingId === employee.id
                  const organizationsLoaded = organizations.length > 0
                  const rowDepartments =
                    organizations.find((org) => org.id === employee.organization_id)?.departments ??
                    []
                  const hasMissingOrgOption =
                    Boolean(employee.organization_id) &&
                    !organizations.some((org) => org.id === employee.organization_id)
                  const hasMissingDeptOption =
                    Boolean(employee.department_id) &&
                    !rowDepartments.some((dept) => dept.id === employee.department_id)
                  return (
                    <TableRow
                      key={employee.id}
                      className={`transition duration-150 ease-in-out hover:bg-slate-50 ${ACCOUNT_STATUS_META[employee.account_status].rowAccentClass}`}
                    >
                      <TableCell className="min-w-[50px] w-8 px-0 text-center">
                        <Checkbox
                          checked={selectedEmployees.has(employee.id)}
                          onCheckedChange={(checked) => handleSelectEmployee(employee.id, checked === true)}
                        />
                      </TableCell>
                      <TableCell className="min-w-[220px] pl-0">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {employee.first_name} {employee.last_name}
                          </span>
                          <span className="text-sm text-gray-500 break-all">{employee.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[120px]">
                        {mode === "global" ? (
                          <Select
                            value={employee.role_id || ""}
                            onValueChange={(value) => handleRoleChange(employee.id, value)}
                            disabled={!roles.length || roleLoadingId === employee.id}
                          >
                            <SelectTrigger className="w-[130px] sm:w-[150px]">
                              <SelectValue placeholder="Rol" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          employee.role_name || employee.role || "-"
                        )}
                      </TableCell>
                      {showOrgColumns && (
                        <>
                          <TableCell className="min-w-[160px]">
                            <div className="flex flex-col gap-2">
                          <Select
                            value={employee.organization_id || "unassigned"}
                                onValueChange={(value) => {
                                  if (value === "unassigned") return
                                  handleOrganizationSelect(employee, value)
                                }}
                                disabled={!organizations.length || membershipUpdating}
                              >
                                <SelectTrigger className="w-full max-w-[190px]">
                                  <SelectValue placeholder="Organización" />
                                </SelectTrigger>
                                <SelectContent>
                                  {!employee.organization_id && (
                                    <SelectItem value="unassigned" disabled>
                                      Sin organización
                                    </SelectItem>
                                  )}
                                  {hasMissingOrgOption && employee.organization_id && (
                                    <SelectItem value={employee.organization_id} disabled>
                                      {employee.organization_name || "Organización no disponible"}
                                    </SelectItem>
                                  )}
                                  {organizations.map((org) => (
                                    <SelectItem key={org.id} value={org.id}>
                                      {org.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {membershipUpdating && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  Guardando cambios...
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[160px]">
                            {employee.organization_id && rowDepartments.length > 0 ? (
                              <Select
                                value={employee.department_id || "unassigned"}
                                onValueChange={(value) => {
                                  if (value === "unassigned") return
                                  handleDepartmentSelect(employee, value)
                                }}
                                disabled={membershipUpdating}
                              >
                                <SelectTrigger className="w-full max-w-[190px]">
                                  <SelectValue placeholder="Departamento" />
                                </SelectTrigger>
                                <SelectContent>
                                  {!employee.department_id && (
                                    <SelectItem value="unassigned" disabled>
                                      Sin departamento
                                    </SelectItem>
                                  )}
                                  {hasMissingDeptOption && employee.department_id && (
                                    <SelectItem value={employee.department_id} disabled>
                                      {employee.department_name || "Departamento no disponible"}
                                    </SelectItem>
                                  )}
                                  {rowDepartments.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id}>
                                      {dept.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : !employee.organization_id ? (
                              <span className="text-xs text-gray-500">Asigna una organización</span>
                            ) : !organizationsLoaded ? (
                              <span className="text-xs text-gray-500">Cargando organizaciones...</span>
                            ) : hasMissingOrgOption ? (
                              <span className="text-xs text-gray-500">Organización no disponible</span>
                            ) : (
                              <span className="text-xs text-gray-500">Organización sin departamentos</span>
                            )}
                          </TableCell>
                        </>
                      )}
                      <TableCell className="max-w-[80px] text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${ACCOUNT_STATUS_META[employee.account_status].badgeClass}`}
                        >
                          {ACCOUNT_STATUS_META[employee.account_status].label}
                        </span>
                      </TableCell>
                      <TableCell className="min-w-[140px] text-center">
                        <div className="flex flex-wrap gap-2">
                          {employee.account_status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                disabled={Boolean(accountActionLoading)}
                                onClick={() => handleAccountStatusChange(employee.id, "approve")}
                              >
                                {approving ? "Aprobando..." : "Aprobar"}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={Boolean(accountActionLoading)}
                                onClick={() => handleAccountStatusChange(employee.id, "reject")}
                              >
                                {rejecting ? "Rechazando..." : "Rechazar"}
                              </Button>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openStatsModal(employee)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setEditUser(employee)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setConfirmDeleteId(employee.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}

            {!loading && paginatedEmployees.length === 0 && (
              <TableRow>
                <TableCell colSpan={columnCount} className="py-8 text-center text-sm text-gray-500">
                  No se encontraron empleados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Mostrando {paginatedEmployees.length} de {filteredEmployees.length} empleados
        </p>
        <div className="flex gap-2">
          <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Anterior
          </Button>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage >= totalPages || paginatedEmployees.length === 0}
          >
            Siguiente
          </Button>
        </div>
      </div>

      {editUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">Editar usuario</h2>

            {editError && <p className="text-sm text-red-600 mb-2">{editError}</p>}

            {editSuccess && <p className="text-sm text-green-600 mb-2">{editSuccess}</p>}

            <div className="space-y-4">
              <Input
                value={editUser.first_name}
                onChange={(e) => setEditUser({ ...editUser, first_name: e.target.value })}
                placeholder="Nombre"
              />
              <Input
                value={editUser.last_name}
                onChange={(e) => setEditUser({ ...editUser, last_name: e.target.value })}
                placeholder="Apellido"
              />
              <Input
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                placeholder="Correo electrónico"
              />
              <Input
                type="password"
                placeholder="Nueva contraseña (opcional)"
                value={editUser.new_password || ""}
                onChange={(e) => setEditUser({ ...editUser, new_password: e.target.value })}
              />
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <Button variant="secondary" onClick={() => setEditUser(null)} disabled={editLoading}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit} disabled={editLoading}>
                {editLoading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">¿Eliminar usuario?</h2>
            <p className="mb-4">
              ¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setConfirmDeleteId(null)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!confirmDeleteId) return
                  try {
                    await handleDelete(confirmDeleteId)
                  } finally {
                    setConfirmDeleteId(null)
                  }
                }}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}

      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">¿Eliminar empleados seleccionados?</h2>
            <p className="text-sm text-gray-600">
              Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar los empleados seleccionados?
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="secondary" onClick={() => setShowBulkDeleteConfirm(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  await handleBulkDelete()
                  setShowBulkDeleteConfirm(false)
                }}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}

      {statsModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4 py-6">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-4 sm:p-6">
            <div className="flex flex-col gap-2 border-b pb-4 mb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Estadísticas de {statsModal.employee.first_name} {statsModal.employee.last_name}
                  </h2>
                  <p className="text-sm text-gray-500">{statsModal.employee.email}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${ACCOUNT_STATUS_META[statsModal.employee.account_status].badgeClass}`}
                >
                  {ACCOUNT_STATUS_META[statsModal.employee.account_status].label}
                </span>
              </div>
            </div>

            {statsModal.loading && (
              <div className="flex items-center justify-center py-10 text-gray-500 gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Cargando estadísticas...
              </div>
            )}

            {!statsModal.loading && statsModal.error && (
              <div className="space-y-4">
                <p className="text-sm text-red-600">{statsModal.error}</p>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setStatsModal(null)}>
                    Cerrar
                  </Button>
                  <Button onClick={() => openStatsModal(statsModal.employee)}>Reintentar</Button>
                </div>
              </div>
            )}

            {!statsModal.loading && !statsModal.error && statsModal.data && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Total de pausas", value: statsModal.data.summary.total_exercises.toLocaleString("es-ES") },
                    { label: "Sesiones esta semana", value: statsModal.data.summary.weekly_sessions.toLocaleString("es-ES") },
                    {
                      label: "Satisfacción promedio",
                      value: `${Number(statsModal.data.summary.avg_satisfaction || 0).toFixed(1)} / 5`,
                    },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
                      <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-gray-500">
                  Última actividad: {formatDateTime(statsModal.employee.last_active)}
                </p>

                <div className="flex flex-wrap gap-3 border-t pt-3 text-sm">
                  {(() => {
                    const baseUrl = `/admin/users/${statsModal.employee.id}/stats`
                    const name = `${statsModal.employee.first_name} ${statsModal.employee.last_name}`.trim()
                    const query = new URLSearchParams({
                      name,
                      email: statsModal.employee.email,
                    }).toString()
                    const detailUrl = `${baseUrl}?${query}`
                    return (
                      <Link className="text-emerald-700 hover:underline" href={detailUrl}>
                        Ver detalle completo
                      </Link>
                    )
                  })()}
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setStatsModal(null)}>Cerrar</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
const DEFAULT_ROLE_FILTERS = [
  { value: "admin", label: "Administrador" },
  { value: "manager", label: "Manager" },
  { value: "superadmin", label: "Superadmin" },
  { value: "user", label: "Usuario" },
]
