'use client'

import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const data = {
  labels: ['Active', 'Occasionally Active', 'Inactive'],
  datasets: [
    {
      data: [68.8, 19.8, 11.3],
      backgroundColor: [
        'rgba(139, 197, 181, 0.8)',
        'rgba(144, 176, 236, 0.8)',
        'rgba(238, 238, 238, 0.8)',
      ],
      borderColor: [
        'rgba(139, 197, 181, 1)',
        'rgba(144, 176, 236, 1)',
        'rgba(238, 238, 238, 1)',
      ],
      borderWidth: 1,
    },
  ],
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
}

export function EngagementChart() {
  return (
      <div className="h-[300px] sm:h-[400px]">
        <Pie data={data} options={options} />
      </div>
  )
}

