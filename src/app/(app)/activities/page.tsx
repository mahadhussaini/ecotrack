'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Leaf, Activity, TrendingUp, Target, Calendar, Zap } from 'lucide-react'

type Activity = {
  id: string
  category: string
  type: string
  amount: number
  unit: string
  date: string
  emissionKgCO2: number
}

const activityCategories = [
  { value: 'TRANSPORT', label: 'Transport', icon: '🚗', color: 'bg-blue-100 text-blue-800' },
  { value: 'ENERGY', label: 'Energy', icon: '⚡', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'FOOD', label: 'Food', icon: '🍽️', color: 'bg-green-100 text-green-800' },
  { value: 'SHOPPING', label: 'Shopping', icon: '🛍️', color: 'bg-purple-100 text-purple-800' },
]

export default function ActivitiesPage() {
  const [category, setCategory] = useState('TRANSPORT')
  const [type, setType] = useState('car')
  const [amount, setAmount] = useState<number>(0)
  const [unit, setUnit] = useState('km')
  const [loading, setLoading] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [weeklyGoal, setWeeklyGoal] = useState(50) // kg CO2
  const [weeklyProgress, setWeeklyProgress] = useState(0)

  const fetchActivities = useCallback(async () => {
    const res = await fetch('/api/activities')
    if (res.ok) {
      const data = await res.json()
      setActivities(data.activities)
      
      // Calculate weekly progress
      const thisWeek = data.activities.filter((a: Activity) => {
        const activityDate = new Date(a.date)
        const weekStart = new Date()
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        weekStart.setHours(0, 0, 0, 0)
        return activityDate >= weekStart
      })
      
      const weeklyEmissions = thisWeek.reduce((sum: number, a: Activity) => sum + a.emissionKgCO2, 0)
      setWeeklyProgress(Math.min((weeklyEmissions / weeklyGoal) * 100, 100))
    }
  }, [weeklyGoal])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  async function addActivity(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, type, amount: Number(amount), unit }),
      })
      if (res.ok) {
        await fetchActivities()
        setAmount(0)
      }
    } finally {
      setLoading(false)
    }
  }

  const selectedCategory = activityCategories.find(c => c.value === category)

  return (
    <div className="container py-4 md:py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 animate-fade-in">
        <h1 className="heading-responsive font-bold text-gradient">
          Log Your Activities 🌱
        </h1>
        <p className="text-muted-foreground text-responsive">
          Track your daily activities and see your environmental impact
        </p>
      </div>

      {/* Weekly Progress */}
      <Card variant="gradient" className="animate-slide-in-from-top">
        <CardHeader>
          <CardTitle className="text-base md:text-lg flex items-center gap-2 text-white">
            <Target className="h-5 w-5" />
            Weekly Carbon Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-white">
              {Math.round(weeklyProgress)}%
            </div>
            <Badge variant="glass" size="lg">
              {weeklyGoal} kg CO₂ goal
            </Badge>
          </div>
          <Progress value={weeklyProgress} variant="eco" size="lg" animated />
          <p className="text-sm text-white/80">
            {weeklyProgress >= 100 ? 'Goal achieved! 🎉' : `${weeklyGoal - Math.round((weeklyProgress / 100) * weeklyGoal)} kg remaining this week`}
          </p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Add Activity Form */}
        <Card variant="eco" hover className="animate-slide-in-from-left">
          <CardHeader>
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-eco-600" />
              Add New Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={addActivity}>
              {/* Category Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {activityCategories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                        category === cat.value
                          ? 'border-eco-500 bg-eco-50 dark:bg-eco-900/20'
                          : 'border-border hover:border-eco-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{cat.icon}</span>
                        <span className="font-medium">{cat.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Activity Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Activity Type</label>
                <Input
                  variant="eco"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="e.g., car, walk, electricity"
                  leftIcon={<Leaf className="h-4 w-4" />}
                />
              </div>
              
              {/* Amount and Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Amount</label>
                  <Input
                    variant="eco"
                    type="number"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Unit</label>
                  <Input
                    variant="eco"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g., km, kWh, kg"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                variant="eco" 
                size="lg" 
                loading={loading}
                leftIcon={<Zap className="h-4 w-4" />}
                className="w-full"
              >
                {loading ? 'Saving...' : 'Save Activity'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card variant="glass" hover className="animate-slide-in-from-right">
          <CardHeader>
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-eco-600" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activities.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🌱</div>
                  <p className="text-sm text-muted-foreground">No activities yet.</p>
                  <p className="text-xs text-muted-foreground">Start by logging your first activity!</p>
                </div>
              )}
              {activities.map((a) => {
                const categoryInfo = activityCategories.find(c => c.value === a.category)
                return (
                  <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg p-4 gap-3 hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{categoryInfo?.icon}</span>
                        <div className="font-medium text-sm">{a.category} • {a.type}</div>
                        <Badge variant="eco" size="sm">
                          {a.category}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {a.amount} {a.unit} — {new Date(a.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right sm:text-left">
                      <div className="font-semibold text-sm text-eco-600">
                        {a.emissionKgCO2} kg CO₂
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {a.emissionKgCO2 > 10 ? 'High impact' : a.emissionKgCO2 > 5 ? 'Medium impact' : 'Low impact'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card variant="eco" hover className="text-center animate-float">
          <CardContent className="pt-6">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-eco-600 mb-1">
              {activities.length}
            </div>
            <p className="text-sm text-muted-foreground">Total Activities</p>
          </CardContent>
        </Card>
        
        <Card variant="glass" hover className="text-center animate-float" style={{ animationDelay: '0.2s' }}>
          <CardContent className="pt-6">
            <div className="text-3xl mb-2">🌍</div>
            <div className="text-2xl font-bold text-eco-600 mb-1">
              {activities.reduce((sum, a) => sum + a.emissionKgCO2, 0).toFixed(1)} kg
            </div>
            <p className="text-sm text-muted-foreground">Total CO₂ Tracked</p>
          </CardContent>
        </Card>
        
        <Card variant="animated" hover className="text-center animate-float" style={{ animationDelay: '0.4s' }}>
          <CardContent className="pt-6">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-eco-600 mb-1">
              {activities.length > 0 ? Math.round(activities.reduce((sum, a) => sum + a.emissionKgCO2, 0) / activities.length * 10) / 10 : 0} kg
            </div>
            <p className="text-sm text-muted-foreground">Average per Activity</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}