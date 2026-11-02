import { prisma } from '../../lib/prisma'

function startOfMonthUTC(date: Date): Date {
  const d = new Date(date)
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
}

/**
 * Recalcula a linha de comissão mensal do contrato (1 linha por contrato/mês)
 * com base na soma de TODOS os boletins ativos do mês de referência.
 *
 * - Só altera linhas PENDING (linhas confirmadas/pagas não são tocadas).
 * - Cria a linha se ainda não existir e houver vendedor/percentual configurado.
 * - Respeita a janela commission_start_date / commission_end_date.
 * Nunca lança erro: falhas de comissão não devem bloquear a medição.
 */
export async function recalculateContractMonthCommission(
  contractId: string,
  referenceDate: Date,
): Promise<void> {
  try {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: {
        id: true,
        sellerId: true,
        commission_percentage: true,
        commission_start_date: true,
        commission_end_date: true,
      },
    })
    if (!contract) return

    const referenceMonth = startOfMonthUTC(referenceDate)
    const nextMonth = new Date(Date.UTC(referenceMonth.getUTCFullYear(), referenceMonth.getUTCMonth() + 1, 1))

    const existing = await prisma.commission.findFirst({
      where: { contractId, reference_month: referenceMonth },
    })

    if (existing && existing.status !== 'PENDING') return

    const percentage = Number(contract.commission_percentage ?? 0)
    const hasConfig = Boolean(contract.sellerId) && percentage > 0

    const inWindow =
      (!contract.commission_start_date || nextMonth > startOfMonthUTC(contract.commission_start_date)) &&
      (!contract.commission_end_date || referenceMonth <= new Date(contract.commission_end_date))

    const bulletins = await prisma.measurementBulletin.findMany({
      where: {
        contractId,
        is_active: true,
        status: { in: ['APPROVED', 'INVOICED'] },
        reference_start: { gte: referenceMonth, lt: nextMonth },
      },
      select: { id: true, total_value: true },
      orderBy: { created_at: 'asc' },
    })

    const baseValue = bulletins.reduce((acc, b) => acc + Number(b.total_value), 0)

    if (existing) {
      const pct = Number(existing.commission_percentage)
      await prisma.commission.update({
        where: { id: existing.id },
        data: {
          base_value: baseValue,
          commission_value: Math.round(baseValue * pct) / 100,
        },
      })
      return
    }

    if (!hasConfig || !inWindow || bulletins.length === 0) return

    await prisma.commission.create({
      data: {
        contractId,
        sellerId: contract.sellerId as string,
        measurementBulletinId: bulletins[0].id,
        reference_month: referenceMonth,
        base_value: baseValue,
        commission_percentage: percentage,
        commission_value: Math.round(baseValue * percentage) / 100,
      },
    })
  } catch (error) {
    console.error('[Commission] Erro ao recalcular comissão mensal:', error)
  }
}
