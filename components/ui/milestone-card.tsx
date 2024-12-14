import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import React from "react";

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
        <Card className={cn("bg-white rounded-lg shadow-sm", className)}>
            <CardContent className="flex items-start gap-4 p-4 sm:p-6">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center">
                    {icon}
                </div>
                <div className="space-y-1">
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </CardContent>
        </Card>
    )
}