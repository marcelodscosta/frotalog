import { FinancialTransaction, Prisma } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { IFinancialTransactionRepository } from '../interfaces/IFinancialTransactionRepository'

const PAGE_SIZE = 20

export class PrismaFinancialTransactionRepository implements IFinancialTransactionRepository {
  async create(data: Prisma.FinancialTransactionCreateInput): Promise<FinancialTransaction> {
    return prisma.financialTransaction.create({ data })
  }

  async findByBankAccount(
    bankAccountId: string,
    page: number,
  ): Promise<{ data: FinancialTransaction[]; total: number }> {
    const [data, total] = await Promise.all([
      prisma.financialTransaction.findMany({
        where: { bankAccountId },
        orderBy: { date: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.financialTransaction.count({ where: { bankAccountId } }),
    ])
    return { data, total }
  }
}
