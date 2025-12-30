import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createOpenAIService } from '@/api'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ recommendations: getDefaultRecommendations() })
  }

  try {
    // Get user's recent activities for AI-powered recommendations
    const recentActivities = await prisma.activity.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' },
      take: 20, // Increased for better AI context
    })

    // Get user's stats for personalization
    const userStats = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        points: true,
        _count: {
          select: {
            activities: true,
          },
        },
      },
    })

    // Generate AI-powered recommendations
    const recommendations = await generateAIRecommendations(recentActivities, userStats)

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('Error generating AI recommendations:', error)
    // Fallback to default recommendations if AI fails
    return NextResponse.json({ recommendations: getDefaultRecommendations() })
  }
}

async function generateAIRecommendations(activities: any[], userStats: any) {
  try {
    const openaiService = createOpenAIService()
    const response = await openaiService.generateRecommendations(activities, userStats)

    if (response.success && response.data) {
      return response.data
    } else {
      console.error('OpenAI service error:', response.error)
      return getDefaultRecommendations()
    }
  } catch (error) {
    console.error('AI recommendation generation failed:', error)
    return getDefaultRecommendations()
  }
}

function getDefaultRecommendations() {
  return [
    'Walk or cycle for short trips under 2km to reduce transportation emissions',
    'Try public transport for your next commute instead of driving',
    'Swap one meat meal for a plant-based alternative this week',
    'Remember to recycle paper, plastic, and glass in your household waste',
    'Turn off electronics and appliances when not in use to save energy',
  ]
}
