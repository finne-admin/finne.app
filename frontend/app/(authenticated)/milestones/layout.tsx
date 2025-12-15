// app/milestones/layout.tsx
import { ReactNode } from "react"
import { MilestonesTabs } from "@/components/milestones/MilestonesTabs"

// app/milestones/layout.tsx
export default function MilestonesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh w-full px-6 py-6">   {/* ← w-full, sin max-w */}
      <MilestonesTabs />                                        {/* asegúrate de que este no tenga max-w */}
      <div className="mt-6 w-full">{children}</div>
    </div>
  )
}

