'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<any | null>(null)
  
  React.useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/admin/stats')
      if (res.ok) setStats(await res.json())
    })()
  }, [])

  const labels = stats ? Object.keys(stats.byDay).sort() : []
  const data = stats ? labels.map((k) => Number(stats.byDay[k].toFixed(2))) : []

  return (
    <div className="container py-4 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <StatCard title="Users" value={stats?.usersCount ?? '—'} />
        <StatCard title="Activities" value={stats?.activitiesCount ?? '—'} />
        <StatCard title="Total Points" value={stats?.totalPoints ?? '—'} />
        <StatCard title="Rewards Redeemed" value={stats?.redemptionsCount ?? '—'} />
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Total CO₂ Logged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">
              {stats ? Number(stats.totalEmissionKgCO2.toFixed(2)) : '—'} kg
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Cumulative emissions tracked by all users
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Emissions (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Line 
                data={{ 
                  labels, 
                  datasets: [{ 
                    label: 'kg CO₂', 
                    data, 
                    borderColor: 'rgb(34,197,94)', 
                    backgroundColor: 'rgba(34,197,94,0.2)' 
                  }] 
                }} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { display: true },
                    y: { display: true }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm md:text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl md:text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}