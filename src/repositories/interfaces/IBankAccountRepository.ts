import { BankAccount, Prisma } from '../../generated/prisma'

export interface IBankAccountRepository {
  create(data: Prisma.BankAccountCreateInput): Promise<BankAccount>
  findById(id: string): Promise<BankAccount | null>
  findAll(): Promise<BankAccount[]>
  update(id: string, data: Prisma.BankAccountUpdateInput): Promise<BankAccount>
  updateBalance(id: string, delta: number): Promise<BankAccount>
  delete(id: string): Promise<void>
}
