'use client'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { BellDot, Library, BarChart2, Settings, Award, LayoutGrid, NotebookPen } from 'lucide-react'

export type MenuItem = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  href: string
}

const regularMenuItems: MenuItem[] = [
  { icon: BellDot, label: 'Pausa Activa', href: '/notification' },
  { icon: Library, label: 'Biblioteca de Ejercicios', href: '/library' },
  { icon: BarChart2, label: 'Estadísticas', href: '/statistics' },
  { icon: Settings, label: 'Ajustes de Cuenta', href: '/settings' },
  { icon: Award, label: 'Logros', href: '/milestones' },
  { icon: NotebookPen, label: 'Cuestionarios', href: '/questionnaires' },
]

const adminMenuItem: MenuItem = { icon: LayoutGrid, label: 'Panel de Administrador', href: '/admin' }

export function useAdminMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !mounted) return
        const { data, error } = await supabase.from('users').select('role').eq('id', user.id).single()
        if (!mounted) return
        if (error) { setMenuItems(regularMenuItems); return }
        setMenuItems(data?.role === 'admin' ? [...regularMenuItems, adminMenuItem] : regularMenuItems)
      } catch {
        setMenuItems(regularMenuItems)
      }
    })()
    return () => { mounted = false }
  }, [supabase])

  return { menuItems }
}
