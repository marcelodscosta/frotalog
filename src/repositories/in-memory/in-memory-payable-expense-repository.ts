import { ExpenseDocument, ExpenseInstallment, PayableExpense, Prisma } from '../../generated/prisma'
import { IPayableExpenseRepository, PayableExpenseWithRelations, CreateExpenseData, ExpenseSummary } from '../interfaces/IPayableExpenseRepository'

export class InMemoryPayableExpenseRepository implements IPayableExpenseRepository {
  public items: PayableExpenseWithRelations[] = []
  public documents: ExpenseDocument[] = []
  public installments: ExpenseInstallment[] = []

  async create(data: CreateExpenseData): Promise<PayableExpenseWithRelations> {
    const expenseId = crypto.randomUUID()
    
    const installments: ExpenseInstallment[] = data.installments.map(inst => ({
      id: crypto.randomUUID(),
      payableExpenseId: expenseId,
      installment_number: inst.installment_number,
      value: inst.value as any, // Decimal type in Prisma, number in test
      due_date: inst.due_date,
      payment_date: null,
      status: 'PENDING',
      barcode: inst.barcode || null,
      pix_key: inst.pix_key || null,
      bankAccountId: null,
      scheduledBankAccountId: null,
      created_at: new Date(),
      updated_at: new Date(),
    }))

    const expense: PayableExpenseWithRelations = {
      id: expenseId,
      description: data.description,
      total_value: data.total_value as any, // Decimal type in Prisma
      payment_method: data.payment_method,
      status: data.status || 'PENDING_FINANCE_APPROVAL',
      maintenanceId: data.maintenanceId || null,
      contractId: data.contractId || null,
      chartOfAccountId: data.chartOfAccountId || null,
      supplierId: data.supplierId || null,
      is_Active: true,
      created_at: new Date(),
      updated_at: new Date(),
      supplier: null,
      installments,
      documents: [],
    } as any

    this.items.push(expense)
    this.installments.push(...installments)
    
    return expense
  }

  async findById(id: string): Promise<PayableExpenseWithRelations | null> {
    const expense = this.items.find(item => item.id === id)
    return expense || null
  }

  async findByMaintenanceId(maintenanceId: string): Promise<PayableExpenseWithRelations[]> {
    return this.items.filter(item => item.maintenanceId === maintenanceId)
  }

  async findPendingByStatus(status: string): Promise<PayableExpenseWithRelations[]> {
    return this.items.filter(item => item.status === status)
  }

  async findAll(page: number, status?: string, filters?: { month?: number; year?: number; search?: string }): Promise<{ data: PayableExpenseWithRelations[]; total: number }> {
    let filtered = this.items
    if (status) filtered = filtered.filter(item => item.status === status)
    
    return {
      data: filtered.slice((page - 1) * 20, page * 20),
      total: filtered.length
    }
  }

  async getSummary(month: number, year: number): Promise<ExpenseSummary> {
    return {
      overdue: 0,
      due_today: 0,
      upcoming: 0,
      paid: 0,
      total: 0
    }
  }

  async updateStatus(id: string, data: Prisma.PayableExpenseUpdateInput): Promise<PayableExpense> {
    const index = this.items.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Expense not found')
    
    const updated = { ...this.items[index], ...data } as PayableExpenseWithRelations
    this.items[index] = updated
    return updated
  }

  async update(id: string, data: any): Promise<PayableExpenseWithRelations> {
    const index = this.items.findIndex(item => item.id === id)
    if (index === -1) throw new Error('Expense not found')
    
    const updated = { ...this.items[index], ...data }
    this.items[index] = updated
    return updated
  }

  async findInstallmentById(id: string): Promise<ExpenseInstallment | null> {
    const inst = this.installments.find(i => i.id === id)
    return inst || null
  }

  async updateInstallmentStatus(id: string, status: any, payment_date?: Date): Promise<ExpenseInstallment> {
    const index = this.installments.findIndex(i => i.id === id)
    if (index === -1) throw new Error('Installment not found')
    
    const updated = { ...this.installments[index], status, payment_date: payment_date || null }
    this.installments[index] = updated
    return updated
  }

  async scheduleInstallment(id: string, bankAccountId: string | null, pix_key?: string | null, barcode?: string | null): Promise<ExpenseInstallment> {
    const index = this.installments.findIndex(i => i.id === id)
    if (index === -1) throw new Error('Installment not found')
    
    const updated = { ...this.installments[index], bankAccountId, pix_key: pix_key || null, barcode: barcode || null, status: 'SCHEDULED' as any }
    this.installments[index] = updated
    return updated
  }

  async findDocumentsByMaintenanceId(maintenanceId: string): Promise<ExpenseDocument[]> {
    return this.documents.filter(doc => {
        const expense = this.items.find(item => item.id === doc.payableExpenseId)
        return expense?.maintenanceId === maintenanceId
    })
  }

  async createDocument(data: {
    payableExpenseId: string
    filename: string
    original_name: string
    file_path: string
    file_size: number
    mime_type: string
    document_type?: string
    description?: string
  }): Promise<ExpenseDocument> {
    const document: ExpenseDocument = {
      id: crypto.randomUUID(),
      payableExpenseId: data.payableExpenseId,
      filename: data.filename,
      original_name: data.original_name,
      file_path: data.file_path,
      file_size: data.file_size,
      mime_type: data.mime_type,
      document_type: data.document_type || null,
      description: data.description || null,
      created_at: new Date(),
    }

    this.documents.push(document)
    return document
  }
}
