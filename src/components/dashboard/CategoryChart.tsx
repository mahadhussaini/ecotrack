'use client'

import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function CategoryChart() {
  const [data, setData] = React.useState<{ labels: string[]; values: number[] }>({ labels: [], values: [] })
  React.useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/stats')
      if (res.ok) {
        const json = await res.json()
        const labels = Object.keys(json.byCategory)
        const values = labels.map((k) => Number(json.byCategory[k].toFixed(2)))
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
        backgroundColor: [
          'rgba(34,197,94,0.5)',
          'rgba(59,130,246,0.5)',
          'rgba(234,179,8,0.5)',
          'rgba(244,63,94,0.5)'
        ],
        borderColor: [
          'rgb(34,197,94)',
          'rgb(59,130,246)',
          'rgb(234,179,8)',
          'rgb(244,63,94)'
        ],
        borderWidth: 1,
      },
    ],
  }

  return <Doughnut data={chartData} />
}

