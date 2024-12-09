import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MilestoneCardProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}

export function MilestoneCard({
                                icon,
                                title,
                                description,
                                className,
                              }: MilestoneCardProps) {
  return (
      <Card className={cn("bg-white", className)}>
        <CardContent className="flex items-start gap-4 p-6">
          <div className="flex-shrink-0">{icon}</div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </CardContent>
      </Card>
  )
}