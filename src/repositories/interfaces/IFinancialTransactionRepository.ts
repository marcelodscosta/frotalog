import { FinancialTransaction, Prisma } from '../../generated/prisma'

export interface TransactionFilters {
  bankAccountId?: string
  month?: number
  year?: number
  search?: string
}

export interface IFinancialTransactionRepository {
  create(data: Prisma.FinancialTransactionCreateInput): Promise<FinancialTransaction>
  findById(id: string): Promise<FinancialTransaction | null>
  update(id: string, data: Prisma.FinancialTransactionUpdateInput): Promise<FinancialTransaction>
  findByBankAccount(bankAccountId: string, page: number): Promise<{ data: FinancialTransaction[]; total: number }>
  findAll(page: number, filters?: TransactionFilters): Promise<{ data: (FinancialTransaction & { bankAccount: { name: string } })[]; total: number; summary: { income: number; expense: number; balance: number; initialBalance?: number } }>
  delete(id: string): Promise<void>
}
