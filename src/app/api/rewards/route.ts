import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [rewards, user] = await Promise.all([
    prisma.reward.findMany({ where: { active: true }, orderBy: { costPoints: 'asc' } }),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { points: true } }),
  ])
  return NextResponse.json({ rewards, points: user?.points ?? 0 })
}

