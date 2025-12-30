'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  TrendingUp,
  Target,
  Award,
  Lightbulb,
  RefreshCw,
  BarChart3,
  Zap,
  Leaf
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Insight {
  type: 'achievement' | 'trend' | 'opportunity' | 'suggestion'
  title: string
  description: string
  metric: string
}

export default function AiInsights() {
  const [insights, setInsights] = useState<Insight[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchInsights = async () => {
    try {
      setRefreshing(true)
      const res = await fetch('/api/ai-insights')
      if (res.ok) {
        const json = await res.json()
        setInsights(json.insights)
      } else {
        setInsights([])
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error)
      setInsights([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Award className="h-5 w-5 text-yellow-600" />
      case 'trend': return <TrendingUp className="h-5 w-5 text-blue-600" />
      case 'opportunity': return <Target className="h-5 w-5 text-green-600" />
      case 'suggestion': return <Lightbulb className="h-5 w-5 text-purple-600" />
      default: return <BarChart3 className="h-5 w-5 text-gray-600" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'border-yellow-200 bg-yellow-50'
      case 'trend': return 'border-blue-200 bg-blue-50'
      case 'opportunity': return 'border-green-200 bg-green-50'
      case 'suggestion': return 'border-purple-200 bg-purple-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'achievement': return 'Achievement'
      case 'trend': return 'Trend'
      case 'opportunity': return 'Opportunity'
      case 'suggestion': return 'Suggestion'
      default: return 'Insight'
    }
  }

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!insights || insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 space-y-3">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto" />
            <div className="text-sm text-muted-foreground">
              No insights available right now.
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchInsights}
              disabled={refreshing}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-eco-600" />
            AI Insights
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchInsights}
            disabled={refreshing}
            className="text-xs"
          >
            <RefreshCw className={cn("h-3 w-3 mr-1", refreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-sm",
                getInsightColor(insight.type)
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-0"
                    >
                      {getTypeLabel(insight.type)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Leaf className="h-3 w-3 mr-1" />
                      {insight.metric}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t text-xs text-muted-foreground">
          🤖 These insights are generated by AI based on your activity patterns and sustainability goals.
          They update automatically as you log more activities!
        </div>
      </CardContent>
    </Card>
  )
}
