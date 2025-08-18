'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function FriendsPage() {
  const [q, setQ] = React.useState('')
  const [results, setResults] = React.useState<any[]>([])
  const [friends, setFriends] = React.useState<any[]>([])

  async function search() {
    if (q.trim().length < 2) return setResults([])
    const res = await fetch(`/api/friends/search?q=${encodeURIComponent(q)}`)
    if (res.ok) {
      const data = await res.json()
      setResults(data.users)
    }
  }

  async function follow(userId: string) {
    await fetch('/api/friends/follow', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) })
    await loadFriends()
  }

  async function unfollow(userId: string) {
    await fetch(`/api/friends/follow?userId=${userId}`, { method: 'DELETE' })
    await loadFriends()
  }

  async function loadFriends() {
    const res = await fetch('/api/leaderboard/friends')
    if (res.ok) {
      const data = await res.json()
      setFriends(data.entries)
    }
  }

  React.useEffect(() => {
    loadFriends()
  }, [])

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Friends</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Find Friends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input className="flex-1 border rounded-md px-3 py-2" placeholder="Search by name or email" value={q} onChange={(e) => setQ(e.target.value)} />
              <Button onClick={search}>Search</Button>
            </div>
            <div className="mt-4 space-y-3">
              {results.map((u) => (
                <div key={u.id} className="flex items-center justify-between border rounded-md px-3 py-2">
                  <div className="font-medium">{u.name || 'Anonymous'}</div>
                  <Button size="sm" onClick={() => follow(u.id)}>Follow</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Friends Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {friends.length === 0 && <p className="text-sm text-muted-foreground">No friends yet.</p>}
              {friends.map((e: any, idx: number) => (
                <div key={e.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 text-center font-semibold">{idx + 1}</div>
                    <div className="font-medium">{e.user?.name || 'Anonymous'}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-semibold">{e.points} pts</div>
                    <Button size="sm" variant="outline" onClick={() => unfollow(e.user.id)}>Unfollow</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

