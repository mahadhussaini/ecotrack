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
  active: boolean 
}

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [costPoints, setCostPoints] = useState<number>(100)
  const [inventory, setInventory] = useState<number | ''>('')

  async function load() {
    const res = await fetch('/api/admin/rewards')
    if (res.ok) {
      const data = await res.json()
      setRewards(data.rewards)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function addReward(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/rewards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title, 
        description, 
        costPoints, 
        inventory: inventory === '' ? null : Number(inventory) 
      }),
    })
    if (res.ok) {
      setTitle('')
      setDescription('')
      setCostPoints(100)
      setInventory('')
      await load()
    }
  }

  return (
    <div className="container py-4 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Rewards Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Add Reward</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={addReward}>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  className="w-full border rounded-md px-3 py-2" 
                  placeholder="Reward title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="w-full border rounded-md px-3 py-2 h-20 resize-none" 
                  placeholder="Reward description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Cost (points)</label>
                  <input 
                    type="number" 
                    className="w-full border rounded-md px-3 py-2" 
                    value={costPoints} 
                    onChange={(e) => setCostPoints(Number(e.target.value))} 
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Inventory (optional)</label>
                  <input 
                    type="number" 
                    className="w-full border rounded-md px-3 py-2" 
                    placeholder="Unlimited if blank" 
                    value={inventory} 
                    onChange={(e) => setInventory(e.target.value === '' ? '' : Number(e.target.value))} 
                    min="0"
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full sm:w-auto">
                Create Reward
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Existing Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {rewards.length === 0 && (
                <p className="text-sm text-muted-foreground">No rewards yet.</p>
              )}
              {rewards.map((r) => (
                <div key={r.id} className="border rounded-md p-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{r.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {r.description || 'No description'}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="font-semibold">{r.costPoints} pts</span>
                        {typeof r.inventory === 'number' && (
                          <span className="text-muted-foreground">
                            Stock: {r.inventory}
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded text-xs ${r.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {r.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
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