import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const s = await prisma.streak.findUnique({ where: { userId: session.user.id } })
  return NextResponse.json({ currentStreak: s?.currentStreak ?? 0, longestStreak: s?.longestStreak ?? 0 })
}

