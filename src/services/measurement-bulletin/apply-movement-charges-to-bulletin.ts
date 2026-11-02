import { Prisma } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { recalculateBulletinTotals } from './recalculate-bulletin-totals'

interface MovementChargesInput {
  bulletinId: string
  contractId: string
  referenceStart: Date
  referenceEnd: Date
  movement: {
    mobilization_date: Date | null
    demobilization_date: Date | null
    freight_value: unknown
  }
}

function dayUTC(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}function isWithin(date: Date | null, start: Date, end: Date): boolean {
  if (!date || date.getFullYear() <= 1970) return false
  const day = dayUTC(date)
  return day >= dayUTC(start) && day <= dayUTC(end)
}

/**
 * Lança mobilização, frete e desmobilização como despesas automáticas do boletim.
 * Cada descrição é lançada uma única vez por contrato, no boletim que cobre a data.
 */
export async function applyMovementChargesToBulletin({
  bulletinId,
  contractId,
  referenceStart,
  referenceEnd,
  movement,
}: MovementChargesInput): Promise<void> {
  const proposal = await prisma.commercialProposal.findFirst({
    where: { contractId, is_active: true },
    select: { mobilization_value: true, demobilization_value: true },
  })

  const charges: Array<{ description: string; value: number }> = []

  if (
    proposal?.mobilization_value &&
    isWithin(movement.mobilization_date, referenceStart, referenceEnd)
  ) {
    charges.push({
      description: 'Mobilização',
      value: Number(proposal.mobilization_value),
    })
  }

  if (
    movement.freight_value &&
    isWithin(movement.mobilization_date, referenceStart, referenceEnd)
  ) {
    charges.push({
      description: 'Frete de mobilização',
      value: Number(movement.freight_value),
    })
  }

  if (
    proposal?.demobilization_value &&
    isWithin(movement.demobilization_date, referenceStart, referenceEnd)
  ) {
    charges.push({
      description: 'Desmobilização',
      value: Number(proposal.demobilization_value),
    })
  }

  if (charges.length === 0) return

  const existing = await prisma.bulletinExpense.findMany({
    where: {
      description: { in: charges.map((charge) => charge.description) },
      measurementBulletin: { contractId, is_active: true },
    },
    select: { description: true },
  })
  const existingDescriptions = new Set(existing.map((item) => item.description))

  const toCreate = charges.filter(
    (charge) => charge.value > 0 && !existingDescriptions.has(charge.description),
  )
  if (toCreate.length === 0) return

  await prisma.bulletinExpense.createMany({
    data: toCreate.map((charge) => ({
      measurementBulletinId: bulletinId,
      description: charge.description,
      quantity: new Prisma.Decimal(1),
      unit_value: new Prisma.Decimal(charge.value.toFixed(2)),
      total_value: new Prisma.Decimal(charge.value.toFixed(2)),
    })),
  })

  await recalculateBulletinTotals(bulletinId)
}
