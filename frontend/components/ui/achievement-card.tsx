import { cn } from '@/lib/utils'

interface AchievementCardProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
  iconClassName?: string
}

export function AchievementCard({
  icon,
  title,
  description,
  className,
  iconClassName
}: AchievementCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow",
      className
    )}>
      <div className="flex items-start gap-4">
        <div className={cn(
          "flex-shrink-0 w-12 h-12",
          iconClassName
        )}>
          {icon}
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  )
}

