'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import BadgeDot from '@/components/ui/BadgeDot'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { usePendingQuestionnaires } from '@/components/hooks/usePendingQuestionnaires'

type MenuItem = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  href: string
}

export function Sidebar({ primaryItems, footerItems }: { primaryItems: MenuItem[]; footerItems: MenuItem[] }) {
  const pathname = usePathname()
  const { pendingCount, loading, hasPending } = usePendingQuestionnaires()

  const renderMenuList = (items: MenuItem[]) =>
    items.map((item, idx) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/milestones' && pathname.startsWith(item.href))

            // Dot para Cuestionarios (admite /questionnaires o /cuestionarios)
            const isQuestionnaires =
              item.href === '/questionnaires' || item.href === '/cuestionarios'

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

                  {/* Puntito a la derecha SOLO para Cuestionarios */}
                    <span className="flex-1" />
                    <span className="flex gap-1 ml-auto">
                    {isQuestionnaires && (
                      <BadgeDot
                      show={!loading && hasPending}
                      title={`Tienes ${pendingCount} cuestionario(s) por responder`}
                      variant="inline"
                      />
                    )}
                    </span>
                </span>
              </Link>
            )
          })

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
        <nav className="space-y-2">{renderMenuList(primaryItems)}</nav>
      </div>

      <div className="mt-auto p-6 flex flex-col gap-6">
        <nav className="space-y-2">{renderMenuList(footerItems)}</nav>
        <LogoutButton />
      </div>
    </div>
  )
}
