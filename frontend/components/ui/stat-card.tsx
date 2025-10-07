import { cn } from "@/lib/utils"
import { Dumbbell, Clock, Flame, Activity } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  change: {
    value: string
    trend: "up" | "down"
  }
  type: "exercises" | "time" | "streak" | "flexibility"
  className?: string
}

export function StatCard({ title, value, change, type, className }: StatCardProps) {
  const icons = {
    exercises: Dumbbell,
    time: Clock,
    streak: Flame,
    flexibility: Activity
  }

  const Icon = icons[type]

  return (
    <div className={cn(
      "bg-white rounded-xl p-6 shadow-sm",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-900">{title}</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
            <p className={cn(
              "text-sm",
              change.trend === "up" ? "text-green-600" : "text-red-600"
            )}>
              {change.trend === "up" ? "↑" : "↓"} {change.value} on this week
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

