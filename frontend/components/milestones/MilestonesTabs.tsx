'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import BadgeDot from '@/components/ui/BadgeDot'
import { useUnclaimedProgressSplit } from '@/components/hooks/useUnclaimedProgressSplit'

const tabs = [
  { label: 'Perfil', href: '/milestones' },
  { label: 'Logros', href: '/milestones/logros' },
  { label: 'Ranking', href: '/milestones/ranking' },
  { label: 'Recompensas', href: '/milestones/recompensas' },
]

export function MilestonesTabs() {
  const pathname = usePathname()
  const { hasWeekly, hasAchievements } = useUnclaimedProgressSplit()

  return (
    <nav className="w-full border-b border-gray-300 mb-6">
      <div className="flex w-full justify-between text-center">
        {tabs.map(({ label, href }) => {
          const isActive =
            pathname === href || (href !== '/milestones' && pathname.startsWith(href))

          const showWeekly = href === '/milestones' && hasWeekly
          const showAchievements = href === '/milestones/logros' && hasAchievements

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 py-2 text-sm font-medium transition-colors rounded-t-md relative',
                isActive
                  ? 'bg-white text-emerald-600 border border-b-transparent shadow-sm'
                  : 'text-gray-600 hover:text-emerald-700'
              )}
            >
              <span className="relative inline-flex items-center gap-2">
                {label}
                {/* Badge semanal → Perfil */}
                {showWeekly && <BadgeDot show className="static ml-1" />}
                {/* Badge logros normales → Logros */}
                {showAchievements && <BadgeDot show className="static ml-1" />}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
