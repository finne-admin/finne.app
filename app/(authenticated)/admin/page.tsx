'use client'

import {useEffect, useState} from 'react'
import { EmployeeTable } from '@/components/ui/data-table'
import { ActivityChart } from '@/components/charts/activity-chart'
import { EngagementChart } from '@/components/charts/engagement-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSessionContext } from '@supabase/auth-helpers-react'


import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
    const { session, isLoading: sessionLoading } = useSessionContext()
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // If session is loading, show a loading state
        if (sessionLoading) {
            return
        }

        // Once sessionLoading is false, we either have a session or not
        if (!session) {
            // No session found, possibly user cleared localStorage or session expired
            // Instead of immediate redirect, we could still show a small loader or directly redirect
            router.push('/login')
        } else {
            // Session found and restored from localStorage
            setLoading(false)
        }
    }, [session, sessionLoading, router])

    if (loading || sessionLoading) {
        return (
            <div className="flex justify-center items-center h-screen p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
                <p className={'text-gray-900'}>Loading...</p>
            </div>
        )
    }

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