import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const me = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (me?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const since = new Date()
  since.setDate(since.getDate() - 30)

  const [usersCount, activitiesCount, pointsAgg, co2Agg, redemptionsCount, recentActivities] = await Promise.all([
    prisma.user.count(),
    prisma.activity.count(),
    prisma.user.aggregate({ _sum: { points: true } }),
    prisma.activity.aggregate({ _sum: { emissionKgCO2: true } }),
    prisma.redemption.count(),
    prisma.activity.findMany({ where: { date: { gte: since } }, orderBy: { date: 'asc' }, select: { date: true, emissionKgCO2: true } }),
  ])

  const byDay: Record<string, number> = {}
  recentActivities.forEach((a) => {
    const day = new Date(a.date).toISOString().slice(0, 10)
    byDay[day] = (byDay[day] || 0) + a.emissionKgCO2
  })

  return NextResponse.json({
    usersCount,
    activitiesCount,
    totalPoints: pointsAgg._sum.points ?? 0,
    totalEmissionKgCO2: co2Agg._sum.emissionKgCO2 ?? 0,
    redemptionsCount,
    byDay,
  })
}

