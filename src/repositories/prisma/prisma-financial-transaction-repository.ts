import { FinancialTransaction, Prisma } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { IFinancialTransactionRepository, TransactionFilters } from '../interfaces/IFinancialTransactionRepository'

const PAGE_SIZE = 500

export class PrismaFinancialTransactionRepository implements IFinancialTransactionRepository {
  async create(data: Prisma.FinancialTransactionCreateInput): Promise<FinancialTransaction> {
    const transaction = await prisma.financialTransaction.create({ data })
    
    // Recalculate bank account balance
    if (transaction.bankAccountId) {
      await this.recalculateBankAccountBalance(transaction.bankAccountId)
    }
    
    return transaction
  }

  async findById(id: string): Promise<FinancialTransaction | null> {
    return prisma.financialTransaction.findUnique({ where: { id } })
  }

  async update(id: string, data: Prisma.FinancialTransactionUpdateInput): Promise<FinancialTransaction> {
    const transaction = await prisma.financialTransaction.update({
      where: { id },
      data,
    })

    // Recalculate bank account balance
    if (transaction.bankAccountId) {
      await this.recalculateBankAccountBalance(transaction.bankAccountId)
    }

    return transaction
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

  async delete(id: string): Promise<void> {
    const transaction = await prisma.financialTransaction.findUnique({
      where: { id },
      select: { bankAccountId: true },
    })

    if (!transaction) return

    await prisma.financialTransaction.delete({ where: { id } })

    // Recalculate bank account balance
    await this.recalculateBankAccountBalance(transaction.bankAccountId)
  }

  private async recalculateBankAccountBalance(bankAccountId: string) {
    const account = await prisma.bankAccount.findUnique({
      where: { id: bankAccountId },
    })

    if (!account) return

    const summary = await prisma.financialTransaction.groupBy({
      by: ['type'],
      where: {
        bankAccountId: account.id,
        date: { gte: account.initial_balance_date || new Date(0) },
      },
      _sum: { amount: true },
    })

    let netChange = new Prisma.Decimal(0)
    for (const item of summary) {
      const amount = item._sum.amount || new Prisma.Decimal(0)
      if (item.type === 'INCOME') {
        netChange = netChange.plus(amount)
      } else {
        netChange = netChange.minus(amount)
      }
    }

    const currentBalance = new Prisma.Decimal(account.initial_balance).plus(netChange)

    await prisma.bankAccount.update({
      where: { id: bankAccountId },
      data: { balance: currentBalance },
    })
  }

  async findAll(
    page: number,
    filters?: TransactionFilters,
  ): Promise<{ data: (FinancialTransaction & { bankAccount: { name: string } })[]; total: number; summary: { income: number; expense: number; balance: number; initialBalance?: number } }> {
    const where: any = {}
    let startDate: Date | undefined;

    if (filters?.bankAccountId) {
      where.bankAccountId = filters.bankAccountId
    }

    if (filters?.month && filters?.year) {
      startDate = new Date(Date.UTC(filters.year, filters.month - 1, 1))
      const endDate = new Date(Date.UTC(filters.year, filters.month, 0, 23, 59, 59, 999))
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

    // Calculate initial balance
    let initialBalance = 0
    const accounts = await prisma.bankAccount.findMany({
      where: filters?.bankAccountId ? { id: filters.bankAccountId } : undefined,
      select: { balance: true }
    })
    const currentTotalBalance = accounts.reduce((acc, a) => acc + Number(a.balance), 0)

    if (startDate) {
      const transactionsSinceStart = await prisma.financialTransaction.findMany({
        where: {
          bankAccountId: filters?.bankAccountId ? filters.bankAccountId : undefined,
          date: { gte: startDate }
        },
        select: { type: true, amount: true }
      })

      let netChangeSinceStart = 0
      for (const t of transactionsSinceStart) {
        if (t.type === 'INCOME') netChangeSinceStart += Number(t.amount)
        else netChangeSinceStart -= Number(t.amount)
      }

      initialBalance = currentTotalBalance - netChangeSinceStart
    } else {
      initialBalance = currentTotalBalance
    }

    return {
      data: data as any,
      total,
      summary: { income, expense, balance: income - expense, initialBalance },
    }
  }
}
