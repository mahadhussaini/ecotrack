'use client'

import React from 'react'

export default function Recommendations() {
  const [recs, setRecs] = React.useState<string[] | null>(null)
  React.useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/recommendations')
      if (res.ok) {
        const json = await res.json()
        setRecs(json.recommendations)
      } else {
        setRecs([])
      }
    })()
  }, [])
  if (recs === null) return <div className="text-sm text-muted-foreground">Loading...</div>
  if (recs.length === 0) return <div className="text-sm text-muted-foreground">No recommendations right now.</div>
  return (
    <ul className="list-disc pl-5 space-y-1 text-sm">
      {recs.map((r, i) => (
        <li key={i}>{r}</li>
      ))}
    </ul>
  )
}

