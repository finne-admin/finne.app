'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
  { label: 'Resumen', href: '/milestones' },
  { label: 'Logros', href: '/milestones/logros' },
  { label: 'Ranking', href: '/milestones/ranking' },
  { label: 'Recompensas', href: '/milestones/recompensas' },
  { label: 'Retos', href: '/milestones/retos' }
]

export function MilestonesTabs() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-2 border-b border-muted mb-4">
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
                ? 'bg-white text-primary border border-b-transparent'
                : 'text-muted-foreground hover:text-primary'
            )}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
