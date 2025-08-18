'use client'

import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend)

export default function DashboardChart() {
  const [data, setData] = React.useState<{ labels: string[]; values: number[] }>({ labels: [], values: [] })
  React.useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/stats')
      if (res.ok) {
        const json = await res.json()
        const labels = Object.keys(json.byDay).sort()
        const values = labels.map((k) => Number(json.byDay[k].toFixed(2)))
        setData({ labels, values })
      }
    })()
  }, [])

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'kg CO₂',
        data: data.values,
        borderColor: 'rgb(34,197,94)',
        backgroundColor: 'rgba(34,197,94,0.2)',
      },
    ],
  }

  return <Line data={chartData} />
}

