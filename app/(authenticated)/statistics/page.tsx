import { StatCard } from '@/components/ui/stat-card'
import { ExerciseProgressChart } from '@/components/charts/exercise-progress-chart'
import { TimeDistributionChart } from '@/components/charts/time-distribution-chart'
import { ActivityTable } from '@/components/ui/activity-table'

export default function StatisticsPage() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
            <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">Progress Overview</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <StatCard
                    title="Exercises Completed"
                    value="20"
                    change={{ value: "+12%", trend: "up" }}
                    type="exercises"
                />
                <StatCard
                    title="Total Time Spent"
                    value="10 min"
                    change={{ value: "+30%", trend: "up" }}
                    type="time"
                />
                <StatCard
                    title="Current Streak"
                    value="7 days"
                    change={{ value: "+02%", trend: "up" }}
                    type="streak"
                />
                <StatCard
                    title="Flexibility Improved"
                    value="+15%"
                    change={{ value: "-02%", trend: "down" }}
                    type="flexibility"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ExerciseProgressChart />
                <TimeDistributionChart />
            </div>

            {/* Activity Table */}
            <ActivityTable />
        </div>
    )
}

