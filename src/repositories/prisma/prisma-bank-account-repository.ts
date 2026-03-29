import { BankAccount, Prisma } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { IBankAccountRepository } from '../interfaces/IBankAccountRepository'

export class PrismaBankAccountRepository implements IBankAccountRepository {
  async create(data: Prisma.BankAccountCreateInput): Promise<BankAccount> {
    return prisma.bankAccount.create({ data })
  }

  async findById(id: string): Promise<BankAccount | null> {
    return prisma.bankAccount.findUnique({ where: { id } })
  }

  async findAll(): Promise<BankAccount[]> {
    return prisma.bankAccount.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
    })
  }

  async update(id: string, data: Prisma.BankAccountUpdateInput): Promise<BankAccount> {
    return prisma.bankAccount.update({ where: { id }, data })
  }

  async updateBalance(id: string, delta: number): Promise<BankAccount> {
    return prisma.bankAccount.update({
      where: { id },
      data: { balance: { increment: delta } },
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.bankAccount.update({ where: { id }, data: { is_active: false } })
  }
}
