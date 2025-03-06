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
      const { error } = await supabase.from("users").delete().eq("id", empId)
      if (error) throw error
      setEmployees((prev) => prev.filter((emp) => emp.id !== empId))
    } catch (error) {
      console.error("Error al eliminar empleado:", error)
    }
  }

  const handleBulkDelete = async () => {
    try {
      const { error } = await supabase
          .from("users")
          .delete()
          .in("id", Array.from(selectedEmployees))

      if (error) throw error
      setEmployees((prev) => prev.filter((emp) => !selectedEmployees.has(emp.id)))
      setSelectedEmployees(new Set())
    } catch (error) {
      console.error("Error al eliminar empleados:", error)
    }
  }



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
                    onClick={handleBulkDelete}
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
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(employee.id)}
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

        <InviteEmployeesDialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
  )
}