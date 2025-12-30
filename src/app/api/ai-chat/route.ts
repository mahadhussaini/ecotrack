import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createOpenAIService } from '@/api'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { message, context = 'general' } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get user's recent activities and stats for personalized responses
    const recentActivities = await prisma.activity.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' },
      take: 10,
    })

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

    const aiResponse = await generateAIResponse(message, context, recentActivities, userStats)

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    )
  }
}

async function generateAIResponse(
  userMessage: string,
  context: string,
  activities: any[],
  userStats: any
) {
  try {
    const openaiService = createOpenAIService()

    const activitySummary = activities.length > 0
      ? activities.map(activity =>
          `${activity.category}: ${activity.type} (${activity.value || activity.amount || 'N/A'}) on ${new Date(activity.date).toLocaleDateString()}`
        ).join('; ')
      : 'No recent activities'

    const systemPrompts = {
      general: `You are EcoTrack AI, a helpful environmental sustainability assistant. Help users with eco-friendly advice, track their progress, and motivate them to make sustainable choices.

User Stats:
- Total Activities: ${userStats?._count?.activities || 0}
- Current Points: ${userStats?.points || 0}
- Recent Activities: ${activitySummary}

Be encouraging, provide specific actionable advice, and focus on environmental impact. Keep responses conversational and helpful.`,

      recommendations: `You are an AI sustainability coach. Based on the user's recent activities and stats, provide personalized recommendations for reducing their carbon footprint.

User Stats:
- Total Activities: ${userStats?._count?.activities || 0}
- Current Points: ${userStats?.points || 0}
- Recent Activities: ${activitySummary}

Provide 2-3 specific, actionable recommendations. Focus on gaps in their current sustainable activities and realistic goals they can achieve.`,

      motivation: `You are an encouraging environmental coach. Help motivate users to maintain their sustainable habits and achieve their eco-goals.

User Stats:
- Total Activities: ${userStats?._count?.activities || 0}
- Current Points: ${userStats?.points || 0}

Be positive, celebrate their achievements, and provide gentle encouragement for areas where they can improve. Use emojis and keep it fun and supportive.`,
    }

    const systemPrompt = systemPrompts[context as keyof typeof systemPrompts] || systemPrompts.general

    const completion = await openaiService.createChatCompletion({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    if (completion.success && completion.data) {
      return completion.data.content.trim()
    } else {
      return "I'm sorry, I couldn't generate a response right now. Please try again later."
    }
  } catch (error) {
    console.error('AI response generation failed:', error)
    return "I'm experiencing some technical difficulties. Please try again in a moment."
  }
}
