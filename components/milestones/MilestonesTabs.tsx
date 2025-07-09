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
    <nav className="flex justify-center border-b border-gray-300 mb-4">
      <div className="flex w-full max-w-3xl">
        {tabs.map(({ label, href }) => {
          const isActive =
            pathname === href || (href !== '/milestones' && pathname.startsWith(href))

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 text-center py-2 text-sm font-medium transition-colors border-b-2',
                isActive
                  ? 'text-emerald-600 border-emerald-500 bg-white shadow-sm'
                  : 'text-gray-600 border-transparent hover:text-emerald-700'
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

