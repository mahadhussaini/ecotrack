import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Activity } from 'lucide-react'
import { Leaf, TrendingUp, Award, Zap, Target } from 'lucide-react'
import StreakSummary from '@/components/dashboard/StreakSummary'
import DashboardChart from '@/components/dashboard/DashboardChart'
import Recommendations from '@/components/dashboard/Recommendations'
import CategoryChart from '@/components/dashboard/CategoryChart'
import QuickActions from '@/components/dashboard/QuickActions'
import AiInsights from '@/components/dashboard/AiInsights'
import AiAssistant from '@/components/ui/ai-assistant'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin')

  const userPoints = (session.user as any)?.points ?? 0
  const pointsToNextLevel = 1000 - (userPoints % 1000)
  const level = Math.floor(userPoints / 1000) + 1
  const progressPercentage = ((userPoints % 1000) / 1000) * 100

  return (
    <div className="container py-4 md:py-8 space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-2 animate-fade-in">
        <h1 className="heading-responsive font-bold text-gradient">
          Welcome back, {session.user?.name || 'Eco Hero'} 🌿
        </h1>
        <p className="text-muted-foreground text-responsive">
          Track your impact and earn rewards for sustainable choices
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {/* Eco Points Card */}
        <Card variant="eco" hover className="stats-card animate-slide-in-from-top">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-eco-600" />
                Eco Points
              </CardTitle>
              <Badge variant="eco" animation="pulse">
                Level {level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl md:text-3xl font-bold text-eco-600">
              {userPoints.toLocaleString()}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress to Level {level + 1}</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} variant="eco" className="h-2" />
              <p className="text-xs text-muted-foreground">
                {pointsToNextLevel} points to next level
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Streak Card */}
        <Card variant="gradient" hover className="stats-card animate-slide-in-from-top" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-white" />
              Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StreakSummary />
          </CardContent>
        </Card>
        
        {/* Weekly Impact Card */}
        <Card variant="glass" hover className="stats-card animate-slide-in-from-top" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-eco-600" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl md:text-3xl font-bold text-eco-600">
              12.5 kg
            </div>
            <p className="text-xs text-muted-foreground">
              CO₂ saved this week
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm">
                +15% vs last week
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions Card */}
        <Card variant="animated" hover className="stats-card animate-slide-in-from-top" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-eco-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QuickActions />
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card variant="eco" hover className="animate-slide-in-from-left">
          <CardHeader>
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-eco-600" />
              Emissions (last 30 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 md:h-80">
              <DashboardChart />
            </div>
          </CardContent>
        </Card>

        <Card variant="glass" hover className="animate-slide-in-from-right">
          <CardHeader>
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-eco-600" />
              By Category (last 30 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 md:h-80">
              <CategoryChart />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        <div className="xl:col-span-2">
          <AiInsights />
        </div>

        <Card variant="animated" hover className="animate-float" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Leaf className="h-5 w-5 text-eco-600" />
              AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Get personalized sustainability advice and answers to your eco-questions.
            </p>
            <div className="text-xs text-muted-foreground">
              💡 Try asking: &ldquo;How can I reduce my carbon footprint?&rdquo; or &ldquo;What activities give the most points?&rdquo;
            </div>
            <AiAssistant context="general" />
          </CardContent>
        </Card>
      </div>

      {/* Recommendations Section */}
      <Card variant="gradient" className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <CardHeader>
          <CardTitle className="text-base md:text-lg flex items-center gap-2 text-white">
            <Leaf className="h-5 w-5" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Recommendations />
        </CardContent>
      </Card>

      {/* Achievement Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card variant="eco" hover className="text-center animate-float">
          <CardContent className="pt-6">
            <div className="text-4xl mb-2">🌱</div>
            <h3 className="font-semibold mb-1">Green Beginner</h3>
            <p className="text-xs text-muted-foreground">Complete your first activity</p>
          </CardContent>
        </Card>
        
        <Card variant="glass" hover className="text-center animate-float" style={{ animationDelay: '0.5s' }}>
          <CardContent className="pt-6">
            <div className="text-4xl mb-2">🚶</div>
            <h3 className="font-semibold mb-1">Walker</h3>
            <p className="text-xs text-muted-foreground">Walk 10km this week</p>
          </CardContent>
        </Card>
        
        <Card variant="animated" hover className="text-center animate-float" style={{ animationDelay: '1s' }}>
          <CardContent className="pt-6">
            <div className="text-4xl mb-2">♻️</div>
            <h3 className="font-semibold mb-1">Recycler</h3>
            <p className="text-xs text-muted-foreground">Recycle 5 items this month</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant - Global Floating Component */}
      <AiAssistant context="general" />

    </div>
  )
}