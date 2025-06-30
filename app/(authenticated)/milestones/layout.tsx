// app/milestones/layout.tsx
import { ReactNode } from "react"
import { MilestonesTabs } from "@/components/milestones/MilestonesTabs"

export default function MilestonesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <MilestonesTabs />
      <div className="mt-6">
        {children}
      </div>
    </div>
  )
}
