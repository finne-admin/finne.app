import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "./button"
import { Checkbox } from "./checkbox"

const activities = [
  {
    id: 1,
    title: "Seated Leg Lifts",
    dateTime: "Oct 10, 2024 - 2:00 PM",
    duration: "30 Seconds",
    type: "Strength"
  },
  {
    id: 2,
    title: "Neck Stretches",
    dateTime: "Oct 10, 2024 - 11:30 AM",
    duration: "30 Seconds",
    type: "Stretching"
  },
  {
    id: 3,
    title: "Desk Push-ups",
    dateTime: "Oct 9, 2024 - 3:45 PM",
    duration: "40 Seconds",
    type: "Strength"
  },
  {
    id: 4,
    title: "Wrist Stretch",
    dateTime: "Oct 9, 2024 - 10:15 AM",
    duration: "20 Seconds",
    type: "Stretching"
  },
  {
    id: 5,
    title: "Chair Twists",
    dateTime: "Oct 8, 2024 - 1:00 PM",
    duration: "30 Seconds",
    type: "Core"
  }
]

export function ActivityTable() {
  return (
      <div className="bg-white rounded-xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">Recent Activity</h3>

        {/* Table Wrapper */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox aria-label="Select all activities" />
                </TableHead>
                <TableHead>Exercise Title</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <Checkbox aria-label={`Select ${activity.title}`} />
                    </TableCell>
                    <TableCell>{activity.title}</TableCell>
                    <TableCell>{activity.dateTime}</TableCell>
                    <TableCell>{activity.duration}</TableCell>
                    <TableCell>{activity.type}</TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
          <p className="text-sm text-gray-500">Page 1 of 10</p>
          <div className="flex gap-2">
            <Button variant="default" className="px-4 py-2">
              Previous
            </Button>
            <Button variant="default" className="px-4 py-2">
              Next
            </Button>
          </div>
        </div>
      </div>
  )
}
