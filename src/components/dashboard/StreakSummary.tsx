'use client'

import React from 'react'

export default function StreakSummary() {
  const [streak, setStreak] = React.useState<{ current: number; longest: number } | null>(null)
  React.useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/streak')
      if (res.ok) {
        const json = await res.json()
        setStreak({ current: json.currentStreak, longest: json.longestStreak })
      }
    })()
  }, [])
  if (!streak) return <div className="text-sm text-muted-foreground">Loading...</div>
  return (
    <div>
      <div className="text-3xl font-bold">{streak.current} days</div>
      <p className="text-sm text-muted-foreground">Longest: {streak.longest} days</p>
    </div>
  )
}

