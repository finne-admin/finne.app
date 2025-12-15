'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmployeeTable } from '@/components/ui/data-table'
import { JoinCodeManager } from '@/components/admin/JoinCodeManager'
import { OrganizationNotificationDefaults } from '@/components/admin/OrganizationNotificationDefaults'
import { RewardsManager } from '@/components/admin/RewardsManager'
import { GlobalStatsPanel } from '@/components/admin/GlobalStatsPanel'

export default function GlobalAdminPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">Administración global</h1>
        <p className="text-sm text-gray-500">
          Gestiona todas las organizaciones, departamentos y códigos de registro desde un único lugar.
        </p>
      </header>

      <Tabs defaultValue="management" className="space-y-6">
        <TabsList className="bg-white shadow-sm rounded-lg">
          <TabsTrigger value="management">Gestión</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="management" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Usuarios de todas las organizaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <EmployeeTable mode="global" />
            </CardContent>
          </Card>
          <OrganizationNotificationDefaults />
          <JoinCodeManager />
          <RewardsManager />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <GlobalStatsPanel />
          
        </TabsContent>
      </Tabs>
    </div>
  )
}
