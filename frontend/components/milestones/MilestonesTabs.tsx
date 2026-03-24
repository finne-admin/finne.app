'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
  { label: 'Perfil', href: '/milestones' },
  { label: 'Logros', href: '/milestones/logros' },
  { label: 'Ranking', href: '/milestones/ranking' },
  { label: 'Recompensas', href: '/milestones/recompensas' },
]

export function MilestonesTabs() {
  const pathname = usePathname()

  return (
    <nav className="mb-4 sm:mb-6">
      <div className="-mx-1 overflow-x-auto border-b border-gray-300 pb-1">
      <div className="flex min-w-max text-center">
        {tabs.map(({ label, href }) => {
          const isActive =
            pathname === href || (href !== '/milestones' && pathname.startsWith(href))

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'shrink-0 px-4 sm:px-5 py-2 text-sm font-medium transition-colors rounded-t-md relative whitespace-nowrap',
                isActive
                  ? 'bg-white text-emerald-600 border border-b-transparent shadow-sm'
                  : 'text-gray-600 hover:text-emerald-700'
              )}
            >
              <span className="relative inline-flex items-center gap-2">
                {label}
              </span>
            </Link>
          )
        })}
      </div>
      </div>
    </nav>
  )
}
