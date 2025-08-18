import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const me = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (me?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
  const offset = (page - 1) * limit

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        points: true,
        createdAt: true,
        _count: {
          select: {
            activities: true,
            redemptions: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.user.count(),
  ])

  return NextResponse.json({ users, total, page, limit })
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const me = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (me?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { userId, role, points } = await request.json()
  if (!userId) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

  const updates: any = {}
  if (role && ['USER', 'ADMIN'].includes(role)) updates.role = role
  if (typeof points === 'number') updates.points = points

  const user = await prisma.user.update({
    where: { id: userId },
    data: updates,
    select: { id: true, name: true, email: true, role: true, points: true }
  })

  return NextResponse.json({ user })
}