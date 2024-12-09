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
import {Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Activity, ChevronDown, UserCircle, Plus} from 'lucide-react'
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
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="w-full sm:w-auto relative">
            <Input
                placeholder="Search..."
                className="pl-8 w-full sm:w-[300px]"
            />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Select>
              <SelectTrigger
                  className="w-full sm:w-[180px] bg-white text-gray-800 border border-gray-300 hover:border-gray-400 focus:border-[#8BC5B5] focus:ring focus:ring-[#8BC5B5] focus:ring-opacity-50 shadow-sm">
                <div className="flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-[#8BC5B5]"/>
                  <SelectValue placeholder="Status"/>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger
                  className="w-full sm:w-[180px] bg-white text-gray-800 border border-gray-300 hover:border-gray-400 focus:border-[#8BC5B5] focus:ring focus:ring-[#8BC5B5] focus:ring-opacity-50 shadow-sm">
                <div className="flex items-center">
                  <UserCircle className="w-4 h-4 mr-2 text-[#8BC5B5]"/>
                  <SelectValue placeholder="Role"/>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
              </SelectContent>
            </Select>

            <Button
                className="w-full sm:w-auto bg-[#8BC5B5] hover:bg-[#7AB4A4] text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 ease-in-out flex items-center justify-center shadow-sm">
              <Plus className="w-4 h-4 mr-2"/>
              Add Employee
            </Button>
          </div>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox/>
                </TableHead>
                <TableHead>Employee Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
                <TableHead className="hidden xl:table-cell">Exercises</TableHead>
                <TableHead className="hidden xl:table-cell">Last Active</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <Checkbox/>
                    </TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{employee.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{employee.role}</TableCell>
                    <TableCell className="hidden lg:table-cell">{employee.status}</TableCell>
                    <TableCell className="hidden xl:table-cell">{employee.exercises}</TableCell>
                    <TableCell className="hidden xl:table-cell">{employee.lastActive}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
  )
}

