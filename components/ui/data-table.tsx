'use client'

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
import {Eye, Pencil, Trash2, Plus} from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"

interface Employee {
  id: string
  name: string
  email: string
  role: string
  status: string
  exercises: number
  lastActive: string
}

const employees: Employee[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    role: "Employee",
    status: "Active",
    exercises: 45,
    lastActive: "2024-10-09"
  },
  {
    id: "2",
    name: "David Smith",
    email: "david.s@company.com",
    role: "Admin",
    status: "Inactive",
    exercises: 30,
    lastActive: "2024-10-10"
  },
  // Add more employees...
]

export function EmployeeTable() {
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(employees.length / itemsPerPage)

  const paginatedEmployees = employees.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  )

  return (
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Input
              placeholder="Search..."
              className="pl-8 w-full sm:w-[300px]"
          />
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-[#8BC5B5] hover:bg-[#7AB4A4] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>Employee Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{employee.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{employee.role}</TableCell>
                    <TableCell className="hidden lg:table-cell">{employee.status}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Pencil />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Page {currentPage} of {totalPages}</p>
          <div className="flex gap-2">
            <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
              Previous
            </Button>
            <Button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
              Next
            </Button>
          </div>
        </div>
      </div>
  )
}

