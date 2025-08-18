import { Prisma } from '@prisma/client'

export const DEFAULT_BADGES = [
  { name: 'First Step', description: 'Logged your first activity', icon: '👣' },
  { name: '7-Day Streak', description: 'Maintained a 7-day activity streak', icon: '🔥' },
  { name: 'Recycler', description: 'Logged a recycling activity', icon: '♻️' },
  { name: 'Public Transporter', description: 'Used public transport instead of car', icon: '🚌' },
  { name: 'Plant-Powered', description: 'Logged a vegan/vegetarian meal', icon: '🥗' },
]

export async function ensureBadgeExists(tx: Prisma.TransactionClient, name: string, description?: string, icon?: string) {
  return tx.badge.upsert({
    where: { name },
    update: { description, icon },
    create: { name, description, icon },
  })
}

export async function awardBadgeIfMissing(tx: Prisma.TransactionClient, userId: string, badgeName: string) {
  const badge = await ensureBadgeExists(tx, badgeName)
  const has = await tx.userBadge.findUnique({ where: { userId_badgeId: { userId, badgeId: badge.id } } })
  if (!has) {
    await tx.userBadge.create({ data: { userId, badgeId: badge.id } })
    return true
  }
  return false
}

