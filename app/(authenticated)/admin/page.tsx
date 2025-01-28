'use client'

import { EmployeeTable } from '@/components/ui/data-table'
import { ActivityChart } from '@/components/charts/activity-chart'
import { EngagementChart } from '@/components/charts/engagement-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'



export default function AdminDashboard() {

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>

            {/* Content Section */}
            <div className="space-y-6 text-gray-900">
                {/* Employee Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Employee Table</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EmployeeTable />
                    </CardContent>
                </Card>

                {/* Charts Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Chart</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ActivityChart />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Engagement Chart</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EngagementChart />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}