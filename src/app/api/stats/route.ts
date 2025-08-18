import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const since = new Date()
  since.setDate(since.getDate() - 30)
  const activities = await prisma.activity.findMany({
    where: { userId: session.user.id, date: { gte: since } },
    orderBy: { date: 'asc' },
  })
  const byDay: Record<string, number> = {}
  const byCategory: Record<string, number> = {}
  activities.forEach((a) => {
    const day = new Date(a.date).toISOString().slice(0, 10)
    byDay[day] = (byDay[day] || 0) + a.emissionKgCO2
    byCategory[a.category] = (byCategory[a.category] || 0) + a.emissionKgCO2
  })
  return NextResponse.json({ byDay, byCategory })
}

