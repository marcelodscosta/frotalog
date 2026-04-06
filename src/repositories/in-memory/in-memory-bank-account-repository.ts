import { BankAccount, Prisma } from '../../generated/prisma'
import { IBankAccountRepository } from '../interfaces/IBankAccountRepository'

export class InMemoryBankAccountRepository implements IBankAccountRepository {
  public items: BankAccount[] = []

  async create(data: Prisma.BankAccountCreateInput): Promise<BankAccount> {
    const bankAccount: BankAccount = {
      id: crypto.randomUUID(),
      name: data.name,
      bank_name: data.bank_name || null,
      account_number: data.account_number || null,
      agency: data.agency || null,
      balance: new Prisma.Decimal(data.balance as any || 0) as any,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(bankAccount)
    return bankAccount
  }

  async findById(id: string): Promise<BankAccount | null> {
    const bankAccount = this.items.find((item) => item.id === id)
    return bankAccount || null
  }

  async findAll(): Promise<BankAccount[]> {
    return this.items
  }

  async update(id: string, data: Prisma.BankAccountUpdateInput): Promise<BankAccount> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) throw new Error('Bank account not found')

    const updated = { ...this.items[index], ...data } as BankAccount
    this.items[index] = updated
    return updated
  }

  async updateBalance(id: string, delta: number): Promise<BankAccount> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) throw new Error('Bank account not found')

    const currentBalance = Number(this.items[index].balance)
    const newBalance = new Prisma.Decimal(currentBalance + delta) as any
    
    this.items[index].balance = newBalance
    this.items[index].updated_at = new Date()

    return this.items[index]
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.items.splice(index, 1)
    }
  }
}
