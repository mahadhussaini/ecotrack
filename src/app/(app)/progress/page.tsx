'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProgressPage() {
  const [badges, setBadges] = React.useState<any[]>([])
  const [streak, setStreak] = React.useState<{ current: number; longest: number } | null>(null)

  React.useEffect(() => {
    ;(async () => {
      const [b, s] = await Promise.all([
        fetch('/api/badges').then((r) => (r.ok ? r.json() : { badges: [] })),
        fetch('/api/streak').then((r) => (r.ok ? r.json() : { currentStreak: 0, longestStreak: 0 })),
      ])
      setBadges(b.badges ?? [])
      setStreak({ current: s.currentStreak, longest: s.longestStreak })
    })()
  }, [])

  return (
    <div className="container py-4 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Your Progress</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Activity Streak</CardTitle>
          </CardHeader>
          <CardContent>
            {streak ? (
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-eco-600 mb-2">
                  {streak.current}
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  Current streak (days)
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg font-semibold">{streak.longest}</div>
                  <div className="text-xs text-muted-foreground">Longest streak</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Loading...</div>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Badges & Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            {badges.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-2">
                  No badges yet. Log activities to earn some!
                </p>
                <p className="text-xs text-muted-foreground">
                  Try walking, recycling, or using public transport
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((ub) => (
                  <div key={ub.id} className="border rounded-lg p-4 text-center hover:bg-muted/50 transition-colors">
                    <div className="text-3xl mb-2">{ub.badge.icon ?? '🏅'}</div>
                    <div className="font-semibold text-sm mb-1">{ub.badge.name}</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {ub.badge.description}
                    </div>
                    <div className="text-xs text-eco-600">
                      Earned {new Date(ub.awardedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Future: Add more progress metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your monthly carbon savings and activity summary will show here.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Set and track personal carbon reduction goals.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}