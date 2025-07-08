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
import { Eye, Pencil, Trash2, Plus, Search } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { InviteEmployeesDialog } from "@/components/InviteEmployeesDialog"

// Skeleton Row Component
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
);

// -------------- Employee interface --------------
interface Employee {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  created_at: string
  last_active: string
  is_active: boolean
  new_password?: string
}

export function EmployeeTable() {
  const [employees, setEmployees] = React.useState<Employee[]>([])
  const [emailError, setEmailError] = React.useState("")
  const [filteredEmployees, setFilteredEmployees] = React.useState<Employee[]>([])
  const [loading, setLoading] = React.useState(true)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("")
  const [roleFilter, setRoleFilter] = React.useState<string>("")
  const [selectedEmployees, setSelectedEmployees] = React.useState<Set<string>>(new Set())
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [emailInput, setEmailInput] = React.useState("")
  const [emailList, setEmailList] = React.useState<string[]>([])
  const [inviteLoading, setInviteLoading] = React.useState(false)
  const [inviteError, setInviteError] = React.useState("")
  const [inviteSuccess, setInviteSuccess] = React.useState("")
  const [viewUser, setViewUser] = React.useState<Employee | null>(null)
  const [editUser, setEditUser] = React.useState<Employee | null>(null)
  const [editLoading, setEditLoading] = React.useState(false)
  const [editError, setEditError] = React.useState("")
  const [editSuccess, setEditSuccess] = React.useState("")
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null)
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = React.useState(false)


  const itemsPerPage = 5
  const supabase = createClientComponentClient()

  // ---------- Pagination ----------
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)
  const paginatedEmployees = filteredEmployees.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  )

  // ---------- Fetch employees ----------
  React.useEffect(() => {
    async function fetchEmployees() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from("users")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) throw error
        if (data) {
          setEmployees(data)
          setFilteredEmployees(data)
        }
      } catch (error) {
        console.error("Error al obtener empleados:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEmployees()
  }, [supabase])

  // ---------- Filters ----------
  React.useEffect(() => {
    let filtered = employees

    if (searchTerm) {
      filtered = filtered.filter((emp) =>
          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${emp.first_name} ${emp.last_name}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter && statusFilter !== "default") {
      filtered = filtered.filter((emp) =>
          statusFilter === "active" ? emp.is_active : !emp.is_active
      )
    }

    if (roleFilter && roleFilter !== "default") {
      filtered = filtered.filter((emp) => emp.role === roleFilter)
    }

    setFilteredEmployees(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, roleFilter, employees])

  // ---------- Select logic ----------
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(new Set(paginatedEmployees.map((emp) => emp.id)))
    } else {
      setSelectedEmployees(new Set())
    }
  }

  const handleSelectEmployee = (empId: string, checked: boolean) => {
    const newSelected = new Set(selectedEmployees)
    if (checked) {
      newSelected.add(empId)
    } else {
      newSelected.delete(empId)
    }
    setSelectedEmployees(newSelected)
  }

  // ---------- Delete logic ----------
  const handleDelete = async (empId: string) => {
    try {
      const res = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: empId }),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Error al eliminar usuario")

      setEmployees((prev) => prev.filter((emp) => emp.id !== empId))
    } catch (error) {
      console.error("Error al eliminar empleado:", error)
    }
  }

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedEmployees)

    try {
      for (const id of ids) {
        const res = await fetch("/api/admin/delete-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: id }),
        })

        const result = await res.json()
        if (!res.ok) throw new Error(result.error || "Error al eliminar usuario")
      }

      setEmployees((prev) => prev.filter((emp) => !selectedEmployees.has(emp.id)))
      setSelectedEmployees(new Set())
    } catch (error) {
      console.error("Error al eliminar empleados:", error)
    }
  }


  // ---------- Edit & View logic ----------
const handleSaveEdit = async () => {
  if (!editUser) return;

  if (!editUser.first_name || !editUser.last_name || !editUser.email) {
    setEditError("Todos los campos son obligatorios");
    return;
  }

  try {
    setEditLoading(true);
    setEditError("");
    setEditSuccess("");

    // 1. Actualizar datos básicos
    const { error: updateError } = await supabase
      .from("users")
      .update({
        first_name: editUser.first_name,
        last_name: editUser.last_name,
        email: editUser.email,
      })
      .eq("id", editUser.id);

    if (updateError) {
      console.error("Error al actualizar datos básicos:", updateError.message);
      throw new Error(updateError.message);
    }

    // 2. Cambiar contraseña si es necesario
    if (editUser.new_password && editUser.new_password.length >= 6) {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editUser.id,
          newPassword: editUser.new_password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Error en el endpoint de contraseña:", result.error || result.message);
        throw new Error(result.error || result.message || "Error al actualizar la contraseña");
      }
    }

    // 3. Actualizar localmente
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === editUser.id ? { ...emp, ...editUser } : emp
      )
    );

    setEditSuccess("Cambios guardados correctamente");
    setTimeout(() => {
      setEditUser(null);
      setEditSuccess("");
    }, 1500);
  } catch (err: any) {
    console.error("Error al guardar cambios:", err);
    setEditError(err.message || "Error desconocido al guardar los cambios");
  } finally {
    setEditLoading(false);
  }
};




  return (
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
                placeholder="Buscar por nombre o email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters & Add Button */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Select value={statusFilter || "default"} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Todos los Estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roleFilter || "default"} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Todos los Roles</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="user">Usuario</SelectItem>
              </SelectContent>
            </Select>

            {selectedEmployees.size > 0 && (
              <Button
                variant="colorRed"
                onClick={() => setShowBulkDeleteConfirm(true)}
                className="whitespace-nowrap"
              >
                Eliminar Seleccionados ({selectedEmployees.size})
              </Button>
            )}

            {/* Button to open Headless UI dialog */}
            <Button
                className="bg-[#8BC5B5] hover:bg-[#7AB4A4] text-white whitespace-nowrap"
                onClick={() => {
                  setIsModalOpen(true)
                  setEmailList([])
                  setEmailInput("")
                  setInviteError("")
                  setInviteSuccess("")
                }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir Empleado
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                      checked={selectedEmployees.size === paginatedEmployees.length}
                      onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Nombre del Empleado</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Rol</TableHead>
                <TableHead className="hidden lg:table-cell">Estado</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                  Array(itemsPerPage).fill(null).map((_, index) => (
                      <SkeletonRow key={index} />
                  ))
              ) : (
                  paginatedEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <Checkbox
                              checked={selectedEmployees.has(employee.id)}
                              onCheckedChange={(checked) =>
                                  handleSelectEmployee(employee.id, checked as boolean)
                              }
                          />
                        </TableCell>
                        <TableCell>
                          {employee.first_name} {employee.last_name}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {employee.email}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{employee.role}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                    <span
                        className={`px-2 py-1 rounded-full text-xs ${
                            employee.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                      {employee.is_active ? "Activo" : "Inactivo"}
                    </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setViewUser(employee)}>
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
                        </TableCell>
                      </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Mostrando {paginatedEmployees.length} de {filteredEmployees.length} empleados
          </p>
          <div className="flex gap-2">
            <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>

                {/* Modal para ver usuario */}
        {viewUser && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Detalles del usuario</h2>
              <p><strong>Nombre:</strong> {viewUser.first_name} {viewUser.last_name}</p>
              <p><strong>Email:</strong> {viewUser.email}</p>
              <p><strong>Rol:</strong> {viewUser.role}</p>
              <p><strong>Activo:</strong> {viewUser.is_active ? "Sí" : "No"}</p>
              <div className="flex justify-end mt-4">
                <Button onClick={() => setViewUser(null)}>Cerrar</Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para editar usuario */}
        {editUser && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
              <h2 className="text-xl font-semibold mb-4">Editar usuario</h2>

              {editError && (
                <p className="text-sm text-red-600 mb-2">{editError}</p>
              )}

              {editSuccess && (
                <p className="text-sm text-green-600 mb-2">{editSuccess}</p>
              )}

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
                  onChange={(e) =>
                    setEditUser({ ...editUser, new_password: e.target.value })
                  }
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
              <p className="mb-4">¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.</p>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setConfirmDeleteId(null)}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    await handleDelete(confirmDeleteId)
                    setConfirmDeleteId(null)
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

        <InviteEmployeesDialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
  )
}