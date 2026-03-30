import { FinancialTransaction, Prisma } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { IFinancialTransactionRepository, TransactionFilters } from '../interfaces/IFinancialTransactionRepository'

const PAGE_SIZE = 50

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

  async findAll(
    page: number,
    filters?: TransactionFilters,
  ): Promise<{ data: (FinancialTransaction & { bankAccount: { name: string } })[]; total: number; summary: { income: number; expense: number; balance: number } }> {
    const where: any = {}

    if (filters?.bankAccountId) {
      where.bankAccountId = filters.bankAccountId
    }

    if (filters?.month && filters?.year) {
      const startDate = new Date(filters.year, filters.month - 1, 1)
      const endDate = new Date(filters.year, filters.month, 0, 23, 59, 59, 999)
      where.date = { gte: startDate, lte: endDate }
    }

    if (filters?.search) {
      where.description = { contains: filters.search, mode: 'insensitive' }
    }

    const [data, total] = await Promise.all([
      prisma.financialTransaction.findMany({
        where,
        include: { bankAccount: { select: { name: true } } },
        orderBy: { date: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.financialTransaction.count({ where }),
    ])

    // Calculate summary for the full period (not just the page)
    const allTransactions = await prisma.financialTransaction.findMany({
      where,
      select: { type: true, amount: true },
    })

    let income = 0
    let expense = 0
    for (const t of allTransactions) {
      if (t.type === 'INCOME') income += Number(t.amount)
      else expense += Number(t.amount)
    }

    return {
      data: data as any,
      total,
      summary: { income, expense, balance: income - expense },
    }
  }
}

