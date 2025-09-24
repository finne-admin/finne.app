'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { HelpCircle, Menu, PlayCircle, Loader2 } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useTutorialState } from '@/components/tutorial/useTutorial'
import { Tutorial } from '@/components/tutorial/Tutorial'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { useAdminMenuItems } from '@/components/hooks/useAdminMenuItems'
import { MobileNav } from '@/components/navigation/MobileNav'
import { Sidebar } from '@/components/navigation/Sidebar'

export function Layout({ children }: { children: React.ReactNode }) {
  const { menuItems } = useAdminMenuItems()
  const { isOpen, startTutorial, stopTutorial } = useTutorialState()

  const supabase = createClientComponentClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data, error } = await supabase.from('users').select('avatar_url').eq('id', user.id).single()
      if (!error && data?.avatar_url) setAvatarUrl(data.avatar_url)
    })()
  }, [supabase])

  const headerContent = useMemo(() => (
    <header className="h-16 border-b bg-white flex justify-between items-center px-4 lg:px-8">
      <div className="flex-1 flex items-center max-w-xl ml-12 lg:ml-0"></div>
      <div className="flex items-center gap-3 sm:gap-4">
        <Button variant="ghost" size="icon" className="hover:bg-gray-200" onClick={() => startTutorial()} title="Iniciar Tutorial">
          <PlayCircle className="h-6 w-6 text-green-600" />
        </Button>
        <Link href="/help/notifications">
          <Button variant="ghost" size="icon" className="hover:bg-gray-200">
            <HelpCircle className="h-6 w-6 text-gray-600" aria-hidden="true" />
          </Button>
        </Link>
        <Link href="/settings">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar"
              width={36}
              height={36}
              className="rounded-full border border-gray-300 hover:scale-105 transition"
              onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.png' }}
            />
          ) : (
            <Image src="/default-avatar.png" alt="Default avatar" width={36} height={36} className="rounded-full border border-gray-300 hover:scale-105 transition" />
          )}
        </Link>
      </div>
    </header>
  ), [startTutorial, avatarUrl])

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
      {/* Mobile drawer */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed left-2 top-2 z-50" aria-label="Abrir menú">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 bg-gradient-to-b from-[#8BC5B5] to-[#5B9B8B] border-none z-[9999]">
          <MobileNav menuItems={menuItems} />
        </SheetContent>
      </Sheet>

      {/* Sidebar desktop */}
      <div className="hidden lg:flex w-64 bg-[#8BC5B5] text-white">
        <Sidebar menuItems={menuItems} />
      </div>

      {/* Main */}
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
