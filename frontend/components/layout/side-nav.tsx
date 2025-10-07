'use client'

import {
  Bell,
  BarChart2,
  Settings,
  Flag,
  LayoutDashboard,
  HelpCircle,
  LogOut,
  Dumbbell,
  Menu
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function SideNav() {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [navigation, setNavigation] = useState<any[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchNavigation() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      const isAdmin = userData?.role === 'admin'

      const baseItems = [
        {
          name: 'Pausa Activa',
          href: '/notifications',
          icon: Bell
        },
        {
          name: 'Biblioteca de Ejercicios',
          href: '/library',
          icon: Dumbbell
        },
        {
          name: 'Estadísticas',
          href: '/statistics',
          icon: BarChart2
        },
        {
          name: 'Ajustes de Cuenta',
          href: '/settings',
          icon: Settings
        },
        {
          name: 'Seguimiento de Logros',
          href: '/milestones',
          icon: Flag
        },
        {
          name: 'Soporte',
          href: '/support',
          icon: HelpCircle
        }
      ]

      if (isAdmin) {
        // Insertar Panel de Administrador antes de Soporte
        baseItems.splice(5, 0, {
          name: 'Panel de Administrador',
          href: '/admin',
          icon: LayoutDashboard
        })
      }

      setNavigation(baseItems)
    }

    fetchNavigation()
  }, [supabase])

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#5BA69B] text-white transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#5BA69B] text-white rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>
      <nav className="space-y-2 flex-1">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                pathname === item.href
                  ? "bg-white/10"
                  : "hover:bg-white/5"
              )}
              onClick={() => setIsSidebarOpen(false)}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="hidden lg:inline">{item.name}</span>
            </Link>
          )
        })}
      </nav>
      <Link
        href="/logout"
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 mt-auto"
      >
        <LogOut className="h-5 w-5" />
        <span>Cerrar sesión</span>
      </Link>
    </div>
  )
}
