import { FinancialTransaction, Prisma } from '../../generated/prisma'

export interface IFinancialTransactionRepository {
  create(data: Prisma.FinancialTransactionCreateInput): Promise<FinancialTransaction>
  findByBankAccount(bankAccountId: string, page: number): Promise<{ data: FinancialTransaction[]; total: number }>
}
