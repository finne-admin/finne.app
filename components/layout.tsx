'use client'

import Link from 'next/link'
import Image from 'next/image'
import React, { useState, useEffect, memo, useMemo } from 'react'
import { Bell, Settings, HelpCircle, Menu, BellDot, Library, BarChart2, Award, LayoutGrid, LogOut, Search, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { cn } from "@/lib/utils"
import {usePathname, useRouter} from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type LucideIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>


// Memoize menu items to prevent unnecessary recreations
type MenuItem = {
  icon: LucideIcon;
  label: string;
  href: string;
}

// Define menu items without 'as const'
const regularMenuItems: MenuItem[] = [
  { icon: BellDot, label: 'Pausa Activa', href: '/notification' },
  { icon: Library, label: 'Biblioteca de Ejercicios', href: '/library' },
  { icon: BarChart2, label: 'Estadísticas', href: '/statistics' },
  { icon: Settings, label: 'Ajustes de Cuenta', href: '/settings' },
  { icon: Award, label: 'Seguimiento de Logros', href: '/milestones' },
]

const adminMenuItem: MenuItem = {
  icon: LayoutGrid,
  label: 'Panel de Administrador',
  href: '/admin',
}

function useAdminCheck() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(regularMenuItems)
  const supabase = createClientComponentClient()

  useEffect(() => {
    let mounted = true

    async function checkUserRole() {
      try {
        // Try to get cached role first
        const cachedRole = localStorage.getItem('userRole')
        if (cachedRole === 'admin' && mounted) {
          setMenuItems([...regularMenuItems, adminMenuItem])
          return
        }

        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !mounted) return

        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!mounted) return

        if (userData?.role === 'admin') {
          localStorage.setItem('userRole', 'admin')
          setMenuItems([...regularMenuItems, adminMenuItem])
        } else {
          localStorage.setItem('userRole', 'user')
          setMenuItems(regularMenuItems)
        }
      } catch (error) {
        console.error('Error checking role:', error)
      }
    }

    checkUserRole()

    return () => {
      mounted = false
    }
  }, [supabase])

  return { menuItems }
}

const LogoutButton = memo(function LogoutButton() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      localStorage.removeItem('userRole')
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
      setIsLoading(false)
    }
  }

  return (
      <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-white hover:bg-white/10 px-4 py-3"
          disabled={isLoading}
      >
        {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              <span className="font-medium">Cerrando sesión...</span>
            </>
        ) : (
            <>
              <LogOut className="h-5 w-5" aria-hidden="true" />
              <span className="font-medium">Cerrar sesión</span>
            </>
        )}
      </Button>
  )
})

const MobileNav = memo(function MobileNav({ menuItems }: { menuItems: MenuItem[] }) {
  const pathname = usePathname()

  return (
      <div className="flex flex-col h-full">
        <SheetHeader className="p-6 text-white border-b border-white/10">
          <SheetTitle className="flex items-center justify-between">
            <Image
                src="/logonegativoRecurso.png"
                alt="Finne Logo"
                width={100}
                height={40}
                priority
            />
            <SheetClose className="rounded-full p-2 hover:bg-white/10">
              <X className="h-5 w-5 text-white"/>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 px-6 py-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        "text-white/90 hover:bg-white/10 hover:text-white",
                        pathname === item.href && "bg-white/20 text-white"
                    )}
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                  <span className="font-medium">{item.label}</span>
                </Link>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-white/10">
          <LogoutButton />
        </div>
      </div>
  )
})

const Sidebar = memo(function Sidebar({ menuItems }: { menuItems: MenuItem[] }) {
  const pathname = usePathname()

  return (
      <div className="flex flex-col h-full w-full">
        <div className="p-6">
          <Image
              src="/logonegativoRecurso.png"
              alt="Finne Logo"
              width={100}
              height={40}
              className="mb-8"
              priority
          />
          <nav className="space-y-2">
            {menuItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        "text-white/90 hover:bg-white/10 hover:text-white",
                        pathname === item.href && "bg-white/20 text-white"
                    )}
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6">
          <LogoutButton />
        </div>
      </div>
  )
})

export function Layout({ children }: { children: React.ReactNode }) {
  const { menuItems } = useAdminCheck()

  const headerContent = useMemo(() => (
      <header className="h-16 border-b bg-white flex justify-between items-center px-4 lg:px-8">
        <div className="flex-1 flex items-center max-w-xl ml-12 lg:ml-0">
          <div className="relative w-full flex items-center">
            <Search className="absolute left-3 w-6 h-6 text-gray-500" aria-hidden="true" />
            <Input
                type="search"
                placeholder="Buscar..."
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-full bg-gray-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8BC5B5] focus-visible:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-gray-200">
            <HelpCircle className="h-6 w-6 text-gray-600" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-gray-200">
            <Settings className="h-6 w-6 text-gray-600" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-gray-200">
            <Bell className="h-6 w-6 text-gray-600" aria-hidden="true" />
          </Button>
          <Avatar className={cn("hover:bg-gray-200")}>
            <AvatarImage src="/path-to-image.jpg" alt="Nombre de Usuario" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
        </div>
      </header>
  ), [])

  return (
      <div className="min-h-screen flex">
        {/* Mobile Sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden fixed left-2 top-2 z-50"
                aria-label="Abrir menú"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
              side="left"
              className="w-80 p-0 bg-gradient-to-b from-[#8BC5B5] to-[#5B9B8B] border-none z-[9999]"
          >
            <MobileNav menuItems={menuItems} />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-64 bg-[#8BC5B5] text-white">
          <Sidebar menuItems={menuItems} />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {headerContent}
          <main className="bg-gray-50">{children}</main>
        </div>
      </div>
  )
}