import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDateKeys } from '@/lib/eco'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { weekKey } = getDateKeys(new Date())

  const follows = await prisma.follow.findMany({ where: { followerId: session.user.id }, select: { followingId: true } })
  const friendIds = [session.user.id, ...follows.map((f) => f.followingId)]

  const entries = await prisma.leaderboardEntry.findMany({
    where: { period: 'WEEKLY', dateKey: weekKey, userId: { in: friendIds } },
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { points: 'desc' },
  })
  return NextResponse.json({ entries })
}

