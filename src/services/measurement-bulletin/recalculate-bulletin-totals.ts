import { Prisma } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'

/**
 * Recalcula despesas e total do boletim a partir das linhas de despesa.
 * `rental_value_total` guarda apenas a locação/medição; `total_value` é a soma final.
 */
export async function recalculateBulletinTotals(
  bulletinId: string,
): Promise<void> {
  const [bulletin, expenses] = await Promise.all([
    prisma.measurementBulletin.findUnique({
      where: { id: bulletinId },
      select: { rental_value_total: true },
    }),
    prisma.bulletinExpense.findMany({
      where: { measurementBulletinId: bulletinId },
      select: { total_value: true },
    }),
  ])

  if (!bulletin) return

  const expensesTotal = expenses.reduce(
    (total, expense) => total + Number(expense.total_value),
    0,
  )
  const rentalTotal = Number(bulletin.rental_value_total)
  const total = Math.round((rentalTotal + expensesTotal) * 100) / 100

  await prisma.measurementBulletin.update({
    where: { id: bulletinId },
    data: {
      expenses_total: new Prisma.Decimal(expensesTotal.toFixed(2)),
      total_value: new Prisma.Decimal(total.toFixed(2)),
    },
  })
}
