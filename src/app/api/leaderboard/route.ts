import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDateKeys } from '@/lib/eco'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(request.url)
  const period = (searchParams.get('period') || 'WEEKLY') as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME'
  const scope = (searchParams.get('scope') || 'global') as 'global' | 'friends'
  const { dayKey, weekKey, monthKey } = getDateKeys(new Date())
  const dateKey = period === 'DAILY' ? dayKey : period === 'WEEKLY' ? weekKey : period === 'MONTHLY' ? monthKey : 'ALL'
  let where: any = { period, dateKey }
  if (scope === 'friends' && session?.user?.id) {
    const friends = await prisma.follow.findMany({ where: { followerId: session.user.id }, select: { followingId: true } })
    const friendIds = friends.map((f) => f.followingId).concat([session.user.id])
    where.userId = { in: friendIds }
  }
  const entries = await prisma.leaderboardEntry.findMany({ where, orderBy: { points: 'desc' }, take: 20, include: { user: { select: { id: true, name: true, image: true } } } })
  return NextResponse.json({ period, dateKey, scope, entries })
}

