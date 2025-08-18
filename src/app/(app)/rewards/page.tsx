'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Reward = { 
  id: string
  title: string
  description?: string | null
  costPoints: number
  inventory?: number | null 
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [points, setPoints] = useState<number>(0)
  const [loading, setLoading] = useState<string | null>(null)

  async function load() {
    const res = await fetch('/api/rewards')
    if (res.ok) {
      const data = await res.json()
      setRewards(data.rewards)
      setPoints(data.points)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function redeem(id: string) {
    setLoading(id)
    try {
      const res = await fetch('/api/rewards/redeem', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ rewardId: id }) 
      })
      if (res.ok) await load()
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="container py-4 md:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold">Rewards</h1>
        <div className="text-lg font-semibold bg-eco-100 text-eco-700 px-3 py-1 rounded-full">
          Your Points: {points}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {rewards.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No rewards available yet.</p>
          </div>
        )}
        {rewards.map((r) => (
          <Card key={r.id} className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg">{r.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 min-h-12">
                {r.description || 'Eco-friendly reward'}
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-eco-600">{r.costPoints} pts</div>
                {typeof r.inventory === 'number' && (
                  <div className="text-xs text-muted-foreground">
                    Stock: {r.inventory}
                  </div>
                )}
              </div>
              
              <Button 
                onClick={() => redeem(r.id)} 
                disabled={
                  loading === r.id || 
                  points < r.costPoints || 
                  (typeof r.inventory === 'number' && r.inventory <= 0)
                }
                className="w-full"
                size="sm"
              >
                {loading === r.id ? 'Redeeming...' : 'Redeem'}
              </Button>
              
              {points < r.costPoints && (
                <p className="text-xs text-red-600 mt-2 text-center">
                  Need {r.costPoints - points} more points
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}