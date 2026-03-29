import { ExpenseDocument, ExpenseInstallment, PayableExpense, Prisma, Supplier } from '../../generated/prisma'

export type PayableExpenseWithRelations = PayableExpense & {
  supplier: Pick<Supplier, 'company_name' | 'trading_name'> | null
  installments: ExpenseInstallment[]
  documents: ExpenseDocument[]
}

export interface CreateExpenseData {
  maintenanceId: string
  supplierId?: string
  description: string
  total_value: number
  payment_method: 'BOLETO' | 'PIX' | 'TRANSFERENCIA' | 'CHEQUE' | 'DINHEIRO' | 'CARTAO'
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
  findAll(page: number, status?: string): Promise<{ data: PayableExpenseWithRelations[]; total: number }>
  updateStatus(id: string, data: Prisma.PayableExpenseUpdateInput): Promise<PayableExpense>
  findInstallmentById(id: string): Promise<ExpenseInstallment | null>
  updateInstallmentStatus(id: string, status: 'PENDING' | 'SCHEDULED' | 'PAID' | 'CANCELLED', payment_date?: Date): Promise<ExpenseInstallment>
}
