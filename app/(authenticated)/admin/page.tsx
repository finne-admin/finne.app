'use client'

import { useState } from 'react'
import { EmployeeTable } from '@/components/ui/data-table'
import { ActivityChart } from '@/components/charts/activity-chart'
import { EngagementChart } from '@/components/charts/engagement-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Upload } from 'lucide-react'

export default function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(false)

    const handleExport = () => {
        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 2000) // Simulating an export process
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">Admin Dashboard</h1>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Upload className="mr-2 h-4 w-4" /> Import
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleExport}
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        {isLoading ? 'Exporting...' : 'Export'}
                    </Button>
                </div>
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