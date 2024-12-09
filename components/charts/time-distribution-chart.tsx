'use client'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const data = {
  labels: ['Stretching', 'Strength', 'Cardio', 'Workouts'],
  datasets: [
    {
      data: [23.23, 17.59, 19.89, 40.79],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(75, 192, 192, 0.8)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1,
    },
  ],
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right' as const,
    },
  },
}

export function TimeDistributionChart() {
  return (
    <div className="bg-white p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Time Spent on Exercise</h3>
      <div className="h-[300px] flex items-center justify-center">
        <Pie data={data} options={options} />
      </div>
    </div>
  )
}

