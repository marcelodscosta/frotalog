import { ExpenseDocument, ExpenseInstallment, PayableExpense, Prisma, Supplier } from '../../generated/prisma'

export interface ExpenseSummary {
  overdue: number
  due_today: number
  upcoming: number
  paid: number
  total: number
}

export type PayableExpenseWithRelations = PayableExpense & {
  supplier: Pick<Supplier, 'company_name' | 'trading_name'> | null
  installments: ExpenseInstallment[]
  documents: ExpenseDocument[]
}

export interface CreateExpenseData {
  maintenanceId?: string
  contractId?: string
  chartOfAccountId?: string
  supplierId?: string
  description: string
  total_value: number
  payment_method: 'BOLETO' | 'PIX' | 'TRANSFERENCIA' | 'CHEQUE' | 'DINHEIRO' | 'CARTAO'
  status?: 'PENDING_MAINTENANCE_APPROVAL' | 'PENDING_FINANCE_APPROVAL'
  installments: Array<{
    installment_number: number
    value: number
    due_date: Date
    barcode?: string
    pix_key?: string
  }>
}

export interface IPayableExpenseRepository {
  create(data: CreateExpenseData): Promise<PayableExpenseWithRelations>
  findById(id: string): Promise<PayableExpenseWithRelations | null>
  findByMaintenanceId(maintenanceId: string): Promise<PayableExpenseWithRelations[]>
  findPendingByStatus(status: string): Promise<PayableExpenseWithRelations[]>
  findAll(page: number, status?: string, filters?: { month?: number; year?: number; search?: string }): Promise<{ data: PayableExpenseWithRelations[]; total: number }>
  getSummary(month: number, year: number): Promise<ExpenseSummary>
  updateStatus(id: string, data: Prisma.PayableExpenseUpdateInput): Promise<PayableExpense>
  update(id: string, data: { description?: string, payment_method?: 'BOLETO' | 'PIX' | 'TRANSFERENCIA' | 'CHEQUE' | 'DINHEIRO' | 'CARTAO', supplierId?: string | null, contractId?: string | null, chartOfAccountId?: string | null }): Promise<PayableExpenseWithRelations>
  findInstallmentById(id: string): Promise<ExpenseInstallment | null>
  updateInstallmentStatus(id: string, status: 'PENDING' | 'SCHEDULED' | 'PAID' | 'CANCELLED', payment_date?: Date): Promise<ExpenseInstallment>
  scheduleInstallment(id: string, bankAccountId: string | null): Promise<ExpenseInstallment>
}
