// app/milestones/layout.tsx
import { ReactNode } from "react"
import { MilestonesTabs } from "@/components/milestones/MilestonesTabs"

export default function MilestonesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full w-full bg-[linear-gradient(180deg,_#f7faf8_0%,_#ffffff_22%,_#ffffff_100%)] px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <MilestonesTabs />
      <div className="w-full">{children}</div>
    </div>
  )
}
