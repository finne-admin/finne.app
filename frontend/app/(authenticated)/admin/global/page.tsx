'use client'

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

export default function GlobalAdminPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-0 flex flex-col gap-6">
      <header className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">Administración global</h1>
        <p className="text-sm text-gray-500">
          Gestiona todas las organizaciones, departamentos y códigos de registro desde un único lugar.
        </p>
      </header>

      <Tabs defaultValue="management" className="flex flex-col gap-6">
        <TabsList className="bg-white shadow-sm rounded-lg">
          <TabsTrigger value="management">Gestión</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          <TabsTrigger value="reset">Reinicio</TabsTrigger>
        </TabsList>

        <TabsContent value="management" className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Usuarios de todas las organizaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <EmployeeTable mode="global" />
            </CardContent>
          </Card>
          <OrganizationManager />
          <OrganizationSeasonTimers />
          <OrganizationNotificationDefaults />
          <JoinCodeManager />
          <RewardsManager />
        </TabsContent>

        <TabsContent value="stats" className="flex flex-col gap-6">
          <GlobalStatsPanel />
          
        </TabsContent>

        <TabsContent value="reset" className="flex flex-col gap-6">
          <GlobalResetPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
