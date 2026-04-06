import { FinancialTransaction, Prisma } from '../../generated/prisma'
import { IFinancialTransactionRepository, TransactionFilters } from '../interfaces/IFinancialTransactionRepository'

export class InMemoryFinancialTransactionRepository implements IFinancialTransactionRepository {
  public items: FinancialTransaction[] = []

  async create(data: Prisma.FinancialTransactionCreateInput): Promise<FinancialTransaction> {
    const transactionId = crypto.randomUUID()
    const transaction: FinancialTransaction = {
      id: transactionId,
      bankAccountId: (data.bankAccount as any).connect.id,
      type: data.type,
      amount: new Prisma.Decimal(data.amount as any) as any,
      date: data.date ? new Date(data.date as any) : new Date(),
      description: (data.description as string) || '',
      receipt_url: data.receipt_url || null,
      expenseInstallmentId: (data as any).expenseInstallment?.connect?.id || null,
      invoiceId: null,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.items.push(transaction)
    return transaction
  }

  async findByBankAccount(bankAccountId: string, page: number): Promise<{ data: FinancialTransaction[]; total: number }> {
    const filtered = this.items.filter((item) => item.bankAccountId === bankAccountId)
    return {
      data: filtered.slice((page - 1) * 20, page * 20),
      total: filtered.length,
    }
  }

  async findAll(page: number, filters?: TransactionFilters): Promise<{ data: (FinancialTransaction & { bankAccount: { name: string } })[]; total: number; summary: { income: number; expense: number; balance: number } }> {
    let filtered = this.items.map(item => ({ ...item, bankAccount: { name: 'Mock Bank' } }))
    
    if (filters?.bankAccountId) filtered = filtered.filter(f => f.bankAccountId === filters.bankAccountId)

    const income = filtered.filter(f => f.type === 'REVENUE' as any).reduce((acc, curr) => acc + Number(curr.amount), 0)
    const expense = filtered.filter(f => f.type === 'EXPENSE' as any).reduce((acc, curr) => acc + Number(curr.amount), 0)

    return {
      data: filtered.slice((page - 1) * 20, page * 20),
      total: filtered.length,
      summary: { income, expense, balance: income - expense }
    }
  }
}
