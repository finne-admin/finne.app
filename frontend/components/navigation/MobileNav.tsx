'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import BadgeDot from '@/components/ui/BadgeDot'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { useUnclaimedCount } from '@/components/hooks/useUnclaimedCount'
import type { MenuItem } from '@/components/hooks/useAdminMenuItems'

export function MobileNav({ menuItems }: { menuItems: MenuItem[] }) {
  const pathname = usePathname()
  const totalUnclaimed = useUnclaimedCount()
  const show = totalUnclaimed > 0

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="p-6 text-white border-b border-white/10">
        <SheetTitle className="flex items-center justify-between">
          <Image src="/logonegativoRecurso.png" alt="Finne Logo" width={100} height={40} priority />
          <SheetClose className="rounded-full p-2 hover:bg-white/10">
            <X className="h-5 w-5 text-white" />
          </SheetClose>
        </SheetTitle>
      </SheetHeader>

      <div className="flex-1 px-6 py-4">
        <nav className="space-y-2">
          {menuItems.map((item, idx) => {
            const isLogros = item.href === '/milestones'
            return (
              <Link
                key={`${item.href}-${idx}`}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  'text-white/90 hover:bg-white/10 hover:text-white',
                  pathname === item.href && 'bg-white/20 text-white'
                )}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                <span className="relative inline-flex items-center gap-2">
                  {item.label}
                  {isLogros && show && <BadgeDot show className="static ml-1" />}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-white/10">
        <LogoutButton />
      </div>
    </div>
  )
}
