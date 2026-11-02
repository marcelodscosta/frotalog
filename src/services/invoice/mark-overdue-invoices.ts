import { prisma } from '../../lib/prisma'

/**
 * Marca como OVERDUE as faturas pendentes cujo vencimento já passou.
 * Mantém PENDING apenas faturas dentro do prazo.
 */
export async function markOverdueInvoices(): Promise<number> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { count } = await prisma.invoice.updateMany({
    where: {
      is_active: true,
      is_paid: false,
      status: 'PENDING',
      due_date: { lt: today },
    },
    data: { status: 'OVERDUE' },
  })

  return count
}
