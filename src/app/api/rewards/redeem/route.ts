import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { rewardId } = await request.json()
  if (!rewardId) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

  const result = await prisma.$transaction(async (tx) => {
    const reward = await tx.reward.findUnique({ where: { id: rewardId } })
    if (!reward || !reward.active) throw new Error('Reward not available')
    const user = await tx.user.findUnique({ where: { id: session.user.id } })
    if (!user || user.points < reward.costPoints) throw new Error('Insufficient points')
    if (typeof reward.inventory === 'number' && reward.inventory <= 0) throw new Error('Out of stock')

    await tx.user.update({ where: { id: user.id }, data: { points: { decrement: reward.costPoints } } })
    await tx.redemption.create({ data: { userId: user.id, rewardId: reward.id, pointsSpent: reward.costPoints } })
    if (typeof reward.inventory === 'number') {
      await tx.reward.update({ where: { id: reward.id }, data: { inventory: { decrement: 1 } } })
    }
    return { ok: true }
  })

  return NextResponse.json(result)
}

