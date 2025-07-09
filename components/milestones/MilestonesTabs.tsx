'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
  { label: 'Perfil', href: '/milestones' },
  { label: 'Logros', href: '/milestones/logros' },
  { label: 'Ranking', href: '/milestones/ranking' },
  { label: 'Recompensas', href: '/milestones/recompensas' }
]

export function MilestonesTabs() {
  const pathname = usePathname()

  return (
    <nav className="w-full border-b border-gray-300 mb-6">
      <div className="flex w-full justify-between text-center">
        {tabs.map(({ label, href }) => {
          const isActive =
            pathname === href || (href !== '/milestones' && pathname.startsWith(href))

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 py-2 text-sm font-medium transition-colors rounded-t-md',
                isActive
                  ? 'bg-white text-emerald-600 border border-b-transparent shadow-sm'
                  : 'text-gray-600 hover:text-emerald-700'
              )}
            >
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

