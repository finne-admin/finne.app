'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const options = {
  indexAxis: 'y' as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
}

const data = {
  labels: ['13 Oct 2024', '12 Oct 2024', '11 Oct 2024', '10 Oct 2024', '9 Oct 2024', '8 Oct 2024'],
  datasets: [
    {
      data: [1, 2.5, 2, 3, 1.5, 3.5],
      backgroundColor: 'rgba(83, 166, 155, 0.5)',
      borderColor: 'rgba(83, 166, 155, 1)',
      borderWidth: 1,
      borderRadius: 4,
    },
  ],
}

export function ActivityChart() {
  return (
      <div className="h-[300px] sm:h-[400px]">
        <Bar options={options} data={data} />
      </div>
  )
}