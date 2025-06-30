'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
  { label: 'Perfil', href: '/milestones' },
  { label: 'Logros', href: '/milestones/logros' },
  { label: 'Ranking', href: '/milestones/ranking' },
  { label: 'Recompensas', href: '/milestones/recompensas' },
  { label: 'Retos', href: '/milestones/retos' }
]

export function MilestonesTabs() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-2 border-b border-gray-300 mb-4">
      {tabs.map(({ label, href }) => {
        const isActive =
          pathname === href || (href !== '/milestones' && pathname.startsWith(href))

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-t-md transition-colors',
              isActive
                ? 'bg-white text-emerald-600 border border-b-transparent shadow-sm'
                : 'text-gray-600 hover:text-emerald-700'
            )}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
