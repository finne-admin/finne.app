'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      min: 0,
      max: 25,
      ticks: {
        stepSize: 5,
      },
    },
  },
}

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const data = {
  labels,
  datasets: [
    {
      fill: true,
      data: [13, 15, 20, 15, 17, 15, 14, 15, 20, 25, 15, 13],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.1)',
      tension: 0.4,
    },
  ],
}

export function ExerciseProgressChart() {
  return (
    <div className="bg-white p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Exercise Progress</h3>
      <div className="h-[300px]">
        <Line options={options} data={data} />
      </div>
    </div>
  )
}

