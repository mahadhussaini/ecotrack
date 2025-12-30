'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { MessageCircle, RefreshCw, CheckCircle, Lightbulb, Target, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Recommendation {
  text: string
  priority: 'high' | 'medium' | 'low'
  category: string
  impact: 'high' | 'medium' | 'low'
}

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [completed, setCompleted] = useState<Set<number>>(new Set())

  const fetchRecommendations = async () => {
    try {
      setRefreshing(true)
      const res = await fetch('/api/recommendations')
      if (res.ok) {
        const json = await res.json()
        // Transform simple strings into structured recommendations
        const structuredRecs = json.recommendations.map((text: string, index: number) => ({
          text,
          priority: index < 2 ? 'high' : 'medium' as const,
          category: categorizeRecommendation(text),
          impact: estimateImpact(text),
        }))
        setRecommendations(structuredRecs)
      } else {
        setRecommendations([])
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
      setRecommendations([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  React.useEffect(() => {
    fetchRecommendations()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const categorizeRecommendation = (text: string): string => {
    if (text.toLowerCase().includes('walk') || text.toLowerCase().includes('bike') || text.toLowerCase().includes('transport')) {
      return 'Transport'
    }
    if (text.toLowerCase().includes('recycle') || text.toLowerCase().includes('waste')) {
      return 'Waste'
    }
    if (text.toLowerCase().includes('eat') || text.toLowerCase().includes('food') || text.toLowerCase().includes('meal')) {
      return 'Food'
    }
    if (text.toLowerCase().includes('energy') || text.toLowerCase().includes('power') || text.toLowerCase().includes('electricity')) {
      return 'Energy'
    }
    return 'General'
  }

  const estimateImpact = (text: string): 'high' | 'medium' | 'low' => {
    if (text.toLowerCase().includes('replace') || text.toLowerCase().includes('switch') || text.toLowerCase().includes('change')) {
      return 'high'
    }
    if (text.toLowerCase().includes('try') || text.toLowerCase().includes('start')) {
      return 'medium'
    }
    return 'low'
  }

  const toggleCompleted = (index: number) => {
    setCompleted(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <TrendingUp className="h-4 w-4 text-red-600" />
      case 'medium': return <Target className="h-4 w-4 text-yellow-600" />
      case 'low': return <Lightbulb className="h-4 w-4 text-green-600" />
      default: return <Lightbulb className="h-4 w-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="text-sm text-muted-foreground">Loading AI recommendations...</div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-6 space-y-3">
        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto" />
        <div className="text-sm text-muted-foreground">
          No recommendations available right now.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchRecommendations}
          disabled={refreshing}
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          AI-powered recommendations based on your activity
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchRecommendations}
          disabled={refreshing}
          className="text-xs"
        >
          <RefreshCw className={cn("h-3 w-3 mr-1", refreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <Card
            key={index}
            className={cn(
              "transition-all duration-200 hover:shadow-md border-l-4",
              completed.has(index)
                ? "border-l-green-500 bg-green-50/50"
                : rec.priority === 'high'
                  ? "border-l-red-500"
                  : rec.priority === 'medium'
                    ? "border-l-yellow-500"
                    : "border-l-green-500"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCompleted(index)}
                  className={cn(
                    "flex-shrink-0 h-6 w-6 rounded-full border-2 transition-colors",
                    completed.has(index)
                      ? "bg-green-500 border-green-500 text-white hover:bg-green-600"
                      : "border-gray-300 hover:border-gray-400"
                  )}
                >
                  {completed.has(index) && <CheckCircle className="h-4 w-4" />}
                </Button>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {getImpactIcon(rec.impact)}
                    <span className={cn(
                      "text-sm font-medium",
                      completed.has(index) && "line-through text-muted-foreground"
                    )}>
                      {rec.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn("text-xs", getPriorityColor(rec.priority))}
                    >
                      {rec.priority} priority
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {rec.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-xs text-muted-foreground border-t pt-3">
        💡 These recommendations are powered by AI and personalized based on your recent activities.
        Mark them complete to track your progress!
      </div>
    </div>
  )
}

