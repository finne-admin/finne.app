'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmployeeTable } from '@/components/ui/data-table'
import { JoinCodeManager } from '@/components/admin/JoinCodeManager'
import { OrganizationNotificationDefaults } from '@/components/admin/OrganizationNotificationDefaults'
import { OrganizationManager } from '@/components/admin/OrganizationManager'
import { RewardsManager } from '@/components/admin/RewardsManager'
import { GlobalStatsPanel } from '@/components/admin/GlobalStatsPanel'
import { OrganizationSeasonTimers } from '@/components/admin/OrganizationSeasonTimers'
import { GlobalResetPanel } from '@/components/admin/GlobalResetPanel'
import { GlobalReportsPanel } from '@/components/admin/GlobalReportsPanel'
import { GlobalAnnouncementsPanel } from '@/components/admin/GlobalAnnouncementsPanel'
import { OrganizationCalendarPanel } from '@/components/admin/OrganizationCalendarPanel'

export default function GlobalAdminPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentTab = useMemo(() => {
    const tab = searchParams.get('tab')
    return tab === 'stats' || tab === 'reset' || tab === 'reports' || tab === 'announcements' || tab === 'calendar' ? tab : 'management'
  }, [searchParams])

  return (
    <div className="px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-0 flex flex-col gap-4 sm:gap-6">
      <header className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">Administración global</h1>
        <p className="max-w-3xl text-sm text-gray-500">
          Gestiona todas las organizaciones, departamentos y códigos de registro desde un único lugar.
        </p>
      </header>

      <Tabs
        value={currentTab}
        onValueChange={(value) => router.replace(`/admin/global?tab=${value}`)}
        className="flex flex-col gap-6"
      >
        <div className="-mx-1 overflow-x-auto pb-1 sm:mx-0">
        <TabsList className="inline-flex min-w-max bg-white shadow-sm rounded-lg">
          <TabsTrigger value="management">Gestión</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          <TabsTrigger value="reset">Reinicio</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="announcements">Avisos</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
        </TabsList>
        </div>

        <TabsContent value="management" className="flex flex-col gap-4 sm:gap-6">
          <OrganizationManager />
          <OrganizationSeasonTimers />
          <OrganizationNotificationDefaults />
          <JoinCodeManager />
          <RewardsManager />
          <Card>
            <CardHeader>
              <CardTitle>Usuarios de todas las organizaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <EmployeeTable mode="global" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="flex flex-col gap-4 sm:gap-6">
          <GlobalStatsPanel />
          
        </TabsContent>

        <TabsContent value="reset" className="flex flex-col gap-4 sm:gap-6">
          <GlobalResetPanel />
        </TabsContent>

        <TabsContent value="reports" className="flex flex-col gap-4 sm:gap-6">
          <GlobalReportsPanel />
        </TabsContent>

        <TabsContent value="announcements" className="flex flex-col gap-4 sm:gap-6">
          <GlobalAnnouncementsPanel />
        </TabsContent>

        <TabsContent value="calendar" className="flex flex-col gap-4 sm:gap-6">
          <OrganizationCalendarPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
