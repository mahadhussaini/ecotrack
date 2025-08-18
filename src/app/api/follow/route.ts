import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const following = await prisma.follow.findMany({
    where: { followerId: session.user.id },
    include: { following: { select: { id: true, name: true, image: true } } },
  })
  return NextResponse.json({ following })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { targetUserId, action } = await request.json()
  if (!targetUserId || !['follow', 'unfollow'].includes(action)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  if (targetUserId === session.user.id) {
    return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
  }
  if (action === 'follow') {
    await prisma.follow.upsert({
      where: { followerId_followingId: { followerId: session.user.id, followingId: targetUserId } },
      update: {},
      create: { followerId: session.user.id, followingId: targetUserId },
    })
  } else {
    await prisma.follow.deleteMany({ where: { followerId: session.user.id, followingId: targetUserId } })
  }
  return NextResponse.json({ ok: true })
}

