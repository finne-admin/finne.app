'use client'

import Link from 'next/link'
import Image from 'next/image'
import React, { useState, useEffect, memo, useMemo } from 'react'
import {
  Bell,
  Settings,
  HelpCircle,
  PlayCircle,
  Menu,
  BellDot,
  Library,
  BarChart2,
  Award,
  LayoutGrid,
  LogOut,
  X,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useTutorialState } from '@/components/tutorial/useTutorial'
import { Tutorial } from '@/components/tutorial/Tutorial'

type LucideIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>

type MenuItem = {
  icon: LucideIcon
  label: string
  href: string
}

const regularMenuItems: MenuItem[] = [
  { icon: BellDot, label: 'Pausa Activa', href: '/notification' },
  { icon: Library, label: 'Biblioteca de Ejercicios', href: '/library' },
  { icon: BarChart2, label: 'Estadísticas', href: '/statistics' },
  { icon: Settings, label: 'Ajustes de Cuenta', href: '/settings' },
  { icon: Award, label: 'Logros', href: '/milestones' }
]

const adminMenuItem: MenuItem = {
  icon: LayoutGrid,
  label: 'Panel de Administrador',
  href: '/admin'
}

function useAdminCheck() {
  const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    let mounted = true

    async function checkUserRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !mounted) return

        const { data: userData, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (!mounted) return
        if (error) {
          console.error('Error fetching user role:', error)
          setMenuItems(regularMenuItems)
          return
        }

        const isAdmin = userData?.role === 'admin'
        setMenuItems(isAdmin ? [...regularMenuItems, adminMenuItem] : regularMenuItems)
      } catch (error) {
        console.error('Error checking role:', error)
        setMenuItems(regularMenuItems)
      }
    }

    checkUserRole()
    return () => { mounted = false }
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
      // 1. Obtener el usuario actual
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw userError || new Error("Usuario no encontrado")

      // 2. Eliminar sus tokens FCM
      const { error: deleteError } = await supabase
        .from("fcm_tokens")
        .delete()
        .eq("user_id", user.id)

      if (deleteError) {
        console.warn("No se pudo eliminar el token FCM:", deleteError.message)
      }

      // 3. Cerrar sesión
      const { error } = await supabase.auth.signOut()
      if (error) throw error

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
            <X className="h-5 w-5 text-white" />
          </SheetClose>
        </SheetTitle>
      </SheetHeader>

      <div className="flex-1 px-6 py-4">
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={`${item.href}-${index}`}
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
          {menuItems.map((item, index) => (
            <Link
              key={`${item.href}-${index}`}
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
  const { isOpen, startTutorial, stopTutorial } = useTutorialState()

  const supabase = createClientComponentClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchAvatar = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('users')
        .select('avatar_url')
        .eq('id', user.id)
        .single()

      if (!error && data?.avatar_url) {
        setAvatarUrl(data.avatar_url)
      }
    }

    fetchAvatar()
  }, [])
  
  const headerContent = useMemo(() => (
    <header className="h-16 border-b bg-white flex justify-between items-center px-4 lg:px-8">
      <div className="flex-1 flex items-center max-w-xl ml-12 lg:ml-0"></div>
      <div className="flex items-center gap-3 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-200"
          onClick={() => {
            startTutorial()
          }}
          title="Iniciar Tutorial"
        >
          <PlayCircle className="h-6 w-6 text-green-600" />
        </Button>
        <Link href="/help/notifications">
          <Button variant="ghost" size="icon" className="hover:bg-gray-200">
            <HelpCircle className="h-6 w-6 text-gray-600" aria-hidden="true" />
          </Button>
        </Link>
        <Link href="/settings">
          <Image
            src={avatarUrl || "/default-avatar.png"} // opcionalmente pon un fallback local
            alt="Avatar"
            width={36}
            height={36}
            className="rounded-full border border-gray-300 hover:scale-105 transition"
          />
        </Link>
      </div>
    </header>
  ), [startTutorial])

  if (!menuItems) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">Cargando...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
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

      <div className="hidden lg:flex w-64 bg-[#8BC5B5] text-white">
        <Sidebar menuItems={menuItems} />
      </div>

      <div className="flex flex-col h-screen flex-1">
        {headerContent}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
        <Tutorial onClose={stopTutorial} run={isOpen} />
      </div>
    </div>
  )
}
