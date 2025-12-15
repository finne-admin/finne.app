'use client'

import { useEffect, useState } from 'react'
import {
  BellDot,
  BarChart2,
  Settings,
  Award,
  LayoutGrid,
  NotebookPen,
  Shield,
} from 'lucide-react'

export type MenuItem = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  href: string
}

type MenuCollections = {
  primary: MenuItem[]
  footer: MenuItem[]
}

const primaryMenuItems: MenuItem[] = [
  { icon: BellDot, label: 'Pausa Activa', href: '/notifications' },
  { icon: BarChart2, label: 'Estadísticas', href: '/statistics' },
  { icon: Award, label: 'Logros', href: '/milestones' },
  { icon: NotebookPen, label: 'Cuestionarios', href: '/questionnaires' },
]

const settingsMenuItem: MenuItem = { icon: Settings, label: 'Ajustes de Cuenta', href: '/settings' }

const adminMenuItem: MenuItem = {
  icon: LayoutGrid,
  label: 'Panel de Administrador',
  href: '/admin',
}

const globalAdminMenuItem: MenuItem = {
  icon: Shield,
  label: 'Administración Global',
  href: '/admin/global',
}

const buildMenus = (opts?: { isOrgAdmin?: boolean; isSuperAdmin?: boolean }): MenuCollections => {
  const footer: MenuItem[] = []
  if (opts?.isSuperAdmin) {
    footer.push(globalAdminMenuItem)
  }
  if (opts?.isOrgAdmin) {
    footer.push(adminMenuItem)
  }
  footer.push(settingsMenuItem)

  return {
    primary: [...primaryMenuItems],
    footer,
  }
}

export function useAdminMenuItems() {
  const [menus, setMenus] = useState<MenuCollections | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchRole = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

        const baseMenus = buildMenus()
        if (!token) {
          setMenus(baseMenus)
          return
        }

        const response = await fetch(`${BASE_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        })

        if (!mounted) return

        if (!response.ok) {
          console.warn('[useAdminMenuItems] fallo /me', response.status)
          setMenus(baseMenus)
          return
        }

        const data = await response.json().catch(() => null)
        const roleRaw: string | undefined =
          data?.user?.roleName ?? data?.user?.role ?? data?.role
        const roleScope: string | undefined = data?.user?.roleScope ?? data?.roleScope
        const normalizedRole = typeof roleRaw === 'string' ? roleRaw.toLowerCase() : undefined

        const isOrgAdmin =
          normalizedRole === 'admin' ||
          normalizedRole === 'manager' ||
          normalizedRole === 'superadmin'
        const isSuperAdmin = normalizedRole === 'superadmin' || roleScope === 'global'

        setMenus(buildMenus({ isOrgAdmin, isSuperAdmin }))
      } catch (error) {
        console.error('[useAdminMenuItems] error inesperado', error)
        if (mounted) setMenus(buildMenus())
      }
    }

    void fetchRole()
    return () => {
      mounted = false
    }
  }, [])

  return menus
}
