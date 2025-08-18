import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { userId } = await request.json()
  if (!userId || userId === session.user.id) return NextResponse.json({ error: 'Invalid user' }, { status: 400 })
  await prisma.follow.create({ data: { followerId: session.user.id, followingId: userId } })
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'Invalid user' }, { status: 400 })
  await prisma.follow.delete({ where: { followerId_followingId: { followerId: session.user.id, followingId: userId } } })
  return NextResponse.json({ ok: true })
}

