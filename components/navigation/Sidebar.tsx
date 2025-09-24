'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import BadgeDot from '@/components/ui/BadgeDot'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { useUnclaimedProgressSplit } from '@/components/hooks/useUnclaimedProgressSplit'

type MenuItem = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  href: string
}

export function Sidebar({ menuItems }: { menuItems: MenuItem[] }) {
  const pathname = usePathname()
  const { hasWeekly, hasAchievements } = useUnclaimedProgressSplit()

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-6">
        <Image src="/logonegativoRecurso.png" alt="Finne Logo" width={100} height={40} className="mb-8" priority />
        <nav className="space-y-2">
          {menuItems.map((item, idx) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/milestones' && pathname.startsWith(item.href))

            // ⬇️ misma lógica que en tus tabs:
            const showWeekly = item.href === '/milestones' && hasWeekly
            const showAchievements =
            (item.href === '/milestones/logros' || item.href === '/milestones') && hasAchievements


            return (
              <Link
                key={`${item.href}-${idx}`}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  'text-white/90 hover:bg-white/10 hover:text-white',
                  isActive && 'bg-white/20 text-white'
                )}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                <span className="relative inline-flex items-center gap-2">
                  {item.label}
                  {(showWeekly || showAchievements) && <BadgeDot show className="static ml-1" />}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <LogoutButton />
      </div>
    </div>
  )
}
