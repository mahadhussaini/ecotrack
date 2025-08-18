'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Entry = {
  id: string
  points: number
  user: { id: string; name: string | null; image: string | null }
}

const periods = ['DAILY', 'WEEKLY', 'MONTHLY', 'ALL_TIME'] as const
const scopes = ['global', 'friends'] as const

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<typeof periods[number]>('WEEKLY')
  const [entries, setEntries] = useState<Entry[]>([])
  const [scope, setScope] = useState<typeof scopes[number]>('global')

  async function fetchLeaderboard() {
    const res = await fetch(`/api/leaderboard?period=${period}&scope=${scope}`)
    if (res.ok) {
      const data = await res.json()
      setEntries(data.entries)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, scope])

  return (
    <div className="container py-4 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Leaderboard</h1>
      
      <div className="mb-4 space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">Period</label>
          <div className="flex flex-wrap gap-2">
            {periods.map((p) => (
              <button 
                key={p} 
                onClick={() => setPeriod(p)} 
                className={`px-3 py-1 rounded-md border text-sm ${
                  period === p 
                    ? 'bg-eco-500 text-white border-eco-600' 
                    : 'hover:bg-muted'
                }`}
              >
                {p.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Scope</label>
          <div className="flex gap-2">
            {scopes.map((s) => (
              <button 
                key={s} 
                onClick={() => setScope(s)} 
                className={`px-3 py-1 rounded-md border text-sm ${
                  scope === s 
                    ? 'bg-eco-500 text-white border-eco-600' 
                    : 'hover:bg-muted'
                }`}
              >
                {s[0].toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Top Contributors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {entries.length === 0 && (
              <p className="text-sm text-muted-foreground">No entries yet.</p>
            )}
            {entries.map((e, idx) => (
              <div key={e.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-eco-100 flex items-center justify-center text-sm font-semibold text-eco-700">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-medium">{e.user?.name || 'Anonymous'}</div>
                    <div className="text-xs text-muted-foreground">
                      {e.points} eco points
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{e.points} pts</div>
                  {idx < 3 && (
                    <div className="text-xs">
                      {idx === 0 && '🥇'}
                      {idx === 1 && '🥈'}
                      {idx === 2 && '🥉'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}