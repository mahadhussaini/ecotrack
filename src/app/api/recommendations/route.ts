import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ recommendations: defaultRecs() })
  }
  // Simple heuristics based on last activities
  const recent = await prisma.activity.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
    take: 10,
  })
  const recs = new Set<string>()
  if (!recent.some((a: any) => a.category === 'TRANSPORT' && (a.type === 'walk' || a.type === 'bike'))) {
    recs.add('Try walking or cycling for short trips under 2km')
  }
  if (!recent.some((a: any) => a.category === 'FOOD' && a.type === 'vegan_meal')) {
    recs.add('Swap one meat meal for a plant-based meal this week')
  }
  if (!recent.some((a: any) => a.category === 'TRANSPORT' && (a.type === 'bus' || a.type === 'train' || a.type === 'public_transport'))) {
    recs.add('Use public transport for your next commute')
  }
  if (!recent.some((a: any) => a.category === 'SHOPPING' && a.type === 'recycle')) {
    recs.add('Recycle paper, plastic, and glass this week')
  }
  const list = Array.from(recs)
  return NextResponse.json({ recommendations: list.length ? list : defaultRecs() })
}

function defaultRecs() {
  return [
    'Walk or cycle for short trips under 2km',
    'Use public transport twice this week',
    'Replace two meat meals with plant-based options',
    'Turn off standby power for appliances overnight',
  ]
}
