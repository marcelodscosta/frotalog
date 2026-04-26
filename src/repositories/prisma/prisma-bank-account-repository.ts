import { BankAccount, Prisma, TransactionType } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { IBankAccountRepository } from '../interfaces/IBankAccountRepository'

export class PrismaBankAccountRepository implements IBankAccountRepository {
  async create(data: Prisma.BankAccountCreateInput): Promise<BankAccount> {
    return prisma.bankAccount.create({ data })
  }

  async findById(id: string): Promise<BankAccount | null> {
    const bankAccount = await prisma.bankAccount.findUnique({ where: { id } })
    if (!bankAccount) return null

    return this.withCalculatedBalance(bankAccount)
  }

  async findAll(): Promise<BankAccount[]> {
    const bankAccounts = await prisma.bankAccount.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
    })

    return Promise.all(bankAccounts.map((account) => this.withCalculatedBalance(account)))
  }

  async update(id: string, data: Prisma.BankAccountUpdateInput): Promise<BankAccount> {
    const bankAccount = await prisma.bankAccount.update({ where: { id }, data })
    return this.recalculateStoredBalance(id)
  }

  async updateBalance(id: string, _delta: number): Promise<BankAccount> {
    // Delta is ignored because we recalculate the whole balance now
    return this.recalculateStoredBalance(id)
  }

  private async withCalculatedBalance(account: BankAccount): Promise<BankAccount> {
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
    
    return {
      ...account,
      balance: currentBalance,
    }
  }

  async recalculateStoredBalance(id: string): Promise<BankAccount> {
    const account = await prisma.bankAccount.findUnique({ where: { id } })
    if (!account) throw new Error('Account not found')

    const calculated = await this.withCalculatedBalance(account)

    return prisma.bankAccount.update({
      where: { id },
      data: { balance: calculated.balance },
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.bankAccount.update({ where: { id }, data: { is_active: false } })
  }
}
