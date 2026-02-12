'use client'

import { EmployeeTable } from '@/components/ui/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OrganizationStatsPanel } from '@/components/admin/OrganizationStatsPanel'

export default function AdminDashboard() {

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">Panel de Administración</h1>
            </div>

            {/* Content Section */}
            <div className="space-y-6 text-gray-900">
                {/* Charts Section */}
                <section className="mt-12 space-y-8">
                    <OrganizationStatsPanel />
                </section>

                {/* Employee Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tabla de Empleados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EmployeeTable mode="organization" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
