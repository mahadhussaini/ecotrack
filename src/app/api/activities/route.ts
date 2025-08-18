import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { computeEmissionKgCO2, awardEcoPoints, getDateKeys } from '@/lib/eco'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { awardBadgeIfMissing } from '@/lib/badges'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const activities = await prisma.activity.findMany({ where: { userId: session.user.id }, orderBy: { date: 'desc' } })
  return NextResponse.json({ activities })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const { category, type, amount, unit, date } = body || {}
  if (!category || !type || typeof amount !== 'number' || !unit) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  const emissionKgCO2 = computeEmissionKgCO2({ category, type, amount, unit, date })
  const points = awardEcoPoints({ category, type, amount, unit, date }, emissionKgCO2)

  const created = await prisma.$transaction(async (tx: any) => {
    const activity = await tx.activity.create({
      data: {
        userId: session.user.id,
        category,
        type,
        amount,
        unit,
        date: date ? new Date(date) : undefined,
        emissionKgCO2,
      },
    })

    // update user points
    await tx.user.update({ where: { id: session.user.id }, data: { points: { increment: points } } })

    // update streaks
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const streak = await tx.streak.findUnique({ where: { userId: session.user.id } })
    if (!streak) {
      await tx.streak.create({
        data: {
          userId: session.user.id,
          currentStreak: 1,
          longestStreak: 1,
          lastActivityDate: today,
        },
      })
    } else {
      const last = streak.lastActivityDate ? new Date(streak.lastActivityDate) : null
      let current = streak.currentStreak
      if (!last || last < yesterday) {
        current = 1
      } else if (last.getTime() === yesterday.getTime()) {
        current = streak.currentStreak + 1
      }
      const longest = Math.max(streak.longestStreak, current)
      await tx.streak.update({
        where: { userId: session.user.id },
        data: { currentStreak: current, longestStreak: longest, lastActivityDate: today },
      })
    }

    // update leaderboard entries
    const { dayKey, weekKey, monthKey } = getDateKeys(date ? new Date(date) : new Date())
    await Promise.all([
      upsertLeaderboard(tx, session.user.id, 'DAILY', dayKey, points),
      upsertLeaderboard(tx, session.user.id, 'WEEKLY', weekKey, points),
      upsertLeaderboard(tx, session.user.id, 'MONTHLY', monthKey, points),
      upsertLeaderboard(tx, session.user.id, 'ALL_TIME', 'ALL', points),
    ])

    // badges
    const priorCount = await tx.activity.count({ where: { userId: session.user.id } })
    if (priorCount === 1) {
      await awardBadgeIfMissing(tx, session.user.id, 'First Step')
    }
    if (type === 'recycle' && category === 'SHOPPING') {
      await awardBadgeIfMissing(tx, session.user.id, 'Recycler')
    }
    if ((type === 'bus' || type === 'train' || type === 'public_transport') && category === 'TRANSPORT') {
      await awardBadgeIfMissing(tx, session.user.id, 'Public Transporter')
    }
    if (type === 'vegan_meal' && category === 'FOOD') {
      await awardBadgeIfMissing(tx, session.user.id, 'Plant-Powered')
    }
    // 7-day streak
    const updatedStreak = await tx.streak.findUnique({ where: { userId: session.user.id } })
    if (updatedStreak && updatedStreak.currentStreak >= 7) {
      await awardBadgeIfMissing(tx, session.user.id, '7-Day Streak')
    }

    return { activity, points }
  })

  return NextResponse.json(created)
}

async function upsertLeaderboard(tx: any, userId: string, period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME', dateKey: string, points: number) {
  await tx.leaderboardEntry.upsert({
    where: {
      userId_period_dateKey: {
        userId,
        period,
        dateKey,
      },
    },
    update: { points: { increment: points } },
    create: { userId, period, dateKey, points },
  })
}

