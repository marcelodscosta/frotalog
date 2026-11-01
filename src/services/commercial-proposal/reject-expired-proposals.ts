import { prisma } from '../../lib/prisma'

const DEFAULT_VALIDITY_DAYS = 5

function addDaysAtStartOfDay(date: Date, days: number): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  result.setDate(result.getDate() + days)
  return result
}

export async function rejectExpiredProposals(): Promise<number> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const candidates = await prisma.commercialProposal.findMany({
    where: {
      is_active: true,
      status: { in: ['DRAFT', 'SENT'] },
    },
    select: { id: true, created_at: true, validity_days: true },
  })

  const expiredIds = candidates
    .filter((proposal) => {
      const validityDays = Number(proposal.validity_days || DEFAULT_VALIDITY_DAYS)
      return addDaysAtStartOfDay(proposal.created_at, validityDays) < today
    })
    .map((proposal) => proposal.id)

  if (expiredIds.length === 0) return 0

  const { count } = await prisma.commercialProposal.updateMany({
    where: { id: { in: expiredIds } },
    data: { status: 'REJECTED' },
  })

  return count
}
