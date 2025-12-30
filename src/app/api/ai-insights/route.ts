import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createOpenAIService } from '@/api'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get user's data for insights
    const [userStats, recentActivities, weeklyData, monthlyData] = await Promise.all([
      // User stats
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          points: true,
          createdAt: true,
          _count: {
            select: {
              activities: true,
            },
          },
        },
      }),

      // Recent activities (last 30 days)
      prisma.activity.findMany({
        where: {
          userId: session.user.id,
          date: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { date: 'desc' },
      }),

      // Weekly activity count
      prisma.activity.groupBy({
        by: ['date'],
        where: {
          userId: session.user.id,
          date: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        _count: true,
      }),

      // Monthly trends
      prisma.activity.groupBy({
        by: ['category'],
        where: {
          userId: session.user.id,
          date: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        _count: true,
        _sum: {
          amount: true,
          emissionKgCO2: true,
        },
      }),
    ])

    const insights = await generateAIInsights(userStats, recentActivities, weeklyData, monthlyData)

    return NextResponse.json({ insights })
  } catch (error) {
    console.error('AI insights error:', error)
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}

async function generateAIInsights(userStats: any, activities: any[], weeklyData: any[], monthlyData: any[]) {
  try {
    const openaiService = createOpenAIService()

    // Calculate some basic metrics
    const totalActivities = userStats?._count?.activities || 0
    const totalPoints = userStats?.points || 0
    const accountAge = userStats?.createdAt
      ? Math.floor((Date.now() - new Date(userStats.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0

    const weeklyActivityCount = weeklyData.length
    const avgDailyActivities = weeklyActivityCount / 7

    const categoryBreakdown = monthlyData.map(cat => ({
      category: cat.category,
      count: cat._count,
      totalValue: cat._sum.amount || cat._sum.emissionKgCO2 || 0,
    }))

    const mostActiveCategory = categoryBreakdown.reduce((max, cat) =>
      cat.count > max.count ? cat : max,
      categoryBreakdown[0] || { category: 'None', count: 0 }
    )

    const prompt = `You are an AI sustainability analyst. Based on this user's data, generate 3-4 insightful observations about their environmental impact and progress. Make them encouraging, data-driven, and actionable.

User Statistics:
- Account age: ${accountAge} days
- Total activities logged: ${totalActivities}
- Current eco-points: ${totalPoints}
- Weekly activity count: ${weeklyActivityCount}
- Average daily activities: ${avgDailyActivities.toFixed(1)}
- Most active category: ${mostActiveCategory.category} (${mostActiveCategory.count} activities)

Recent Activity Categories (last 30 days):
${categoryBreakdown.map(cat => `- ${cat.category}: ${cat.count} activities`).join('\n')}

Guidelines for insights:
1. Focus on positive trends and achievements
2. Identify areas for improvement
3. Provide specific, actionable suggestions
4. Use encouraging and motivational language
5. Include relevant metrics and comparisons
6. Keep each insight to 1-2 sentences

Return a JSON array of insight objects with this structure:
[{"type": "achievement|trend|opportunity|suggestion", "title": "Brief title", "description": "Detailed insight", "metric": "relevant number or percentage"}]

Return only valid JSON, no additional text.`

    const completion = await openaiService.createChatCompletion({
      messages: [
        {
          role: 'system',
          content: 'You are a sustainability analyst providing data-driven insights. Always respond with valid JSON arrays of insight objects.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 600,
      temperature: 0.7,
    })

    if (completion.success && completion.data) {
      try {
        const insights = JSON.parse(completion.data.content.trim())

        if (Array.isArray(insights) && insights.every(insight =>
          insight.type && insight.title && insight.description
        )) {
          return insights.slice(0, 4) // Limit to 4 insights
        }
      } catch (parseError) {
        console.error('Failed to parse AI insights:', parseError)
      }
    }

    // Fallback insights if AI fails
    return [
      {
        type: 'achievement',
        title: 'Great Start!',
        description: `You've logged ${totalActivities} activities since joining ${accountAge} days ago. Keep up the excellent work!`,
        metric: `${totalActivities} activities`,
      },
      {
        type: 'trend',
        title: 'Weekly Activity',
        description: `You're averaging ${avgDailyActivities.toFixed(1)} activities per day this week. Consistency is key to environmental impact!`,
        metric: `${avgDailyActivities.toFixed(1)}/day`,
      },
      {
        type: 'opportunity',
        title: 'Category Focus',
        description: `${mostActiveCategory.category} is your most active category with ${mostActiveCategory.count} activities. Try exploring other sustainable categories!`,
        metric: mostActiveCategory.category,
      },
    ]
  } catch (error) {
    console.error('AI insights generation failed:', error)
    return [
      {
        type: 'achievement',
        title: 'Eco Journey Started',
        description: 'You\'ve begun your sustainability journey. Every small action contributes to a greener planet!',
        metric: 'Journey started',
      },
    ]
  }
}
