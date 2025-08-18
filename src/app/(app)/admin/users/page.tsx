'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type User = {
  id: string
  name: string | null
  email: string | null
  role: 'USER' | 'ADMIN'
  points: number
  createdAt: string
  _count: {
    activities: number
    redemptions: number
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<User[]>([])
  const [total, setTotal] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [loading, setLoading] = React.useState(false)

  async function loadUsers() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users?page=${page}&limit=20`)
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users)
        setTotal(data.total)
      }
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  async function updateUser(userId: string, updates: { role?: string; points?: number }) {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...updates }),
    })
    if (res.ok) await loadUsers()
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="container py-4 md:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold">Users ({total})</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page <= 1} 
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="px-3 py-1 text-sm">Page {page} of {totalPages}</span>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page >= totalPages} 
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">User</th>
                    <th className="text-left p-2 hidden sm:table-cell">Email</th>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Points</th>
                    <th className="text-left p-2 hidden md:table-cell">Activities</th>
                    <th className="text-left p-2 hidden lg:table-cell">Joined</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">
                        <div className="truncate max-w-32">
                          {user.name || 'Anonymous'}
                        </div>
                        <div className="text-xs text-muted-foreground sm:hidden truncate">
                          {user.email}
                        </div>
                      </td>
                      <td className="p-2 text-muted-foreground hidden sm:table-cell">
                        <div className="truncate max-w-48">{user.email}</div>
                      </td>
                      <td className="p-2">
                        <select 
                          value={user.role} 
                          onChange={(e) => updateUser(user.id, { role: e.target.value })}
                          className="text-xs border rounded px-2 py-1 w-full max-w-20"
                        >
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="p-2 font-mono text-sm">{user.points}</td>
                      <td className="p-2 hidden md:table-cell">{user._count.activities}</td>
                      <td className="p-2 hidden lg:table-cell text-xs">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            const points = prompt('Set points:', user.points.toString())
                            if (points !== null) updateUser(user.id, { points: parseInt(points) })
                          }}
                          className="text-xs"
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}