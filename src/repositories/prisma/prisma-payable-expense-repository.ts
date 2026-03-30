import { ExpenseDocument, ExpenseInstallment, PayableExpense, Prisma } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import {
  CreateExpenseData,
  ExpenseSummary,
  IPayableExpenseRepository,
  PayableExpenseWithRelations,
} from '../interfaces/IPayableExpenseRepository'

const INCLUDE_RELATIONS = {
  supplier: { select: { company_name: true, trading_name: true } },
  installments: { orderBy: { installment_number: 'asc' } as const },
  documents: true,
  maintenance: { select: { id: true, description: true } },
}

const PAGE_SIZE = 20

export class PrismaPayableExpenseRepository implements IPayableExpenseRepository {
  async create(data: CreateExpenseData): Promise<PayableExpenseWithRelations> {
    const { maintenanceId, contractId, chartOfAccountId, supplierId, description, total_value, payment_method, installments, status } = data

    return prisma.payableExpense.create({
      data: {
        maintenanceId: maintenanceId || null,
        contractId: contractId || null,
        chartOfAccountId: chartOfAccountId || null,
        supplierId: supplierId || null,
        description,
        total_value,
        payment_method,
        ...(status ? { status } : {}),
        installments: {
          create: installments.map((inst) => ({
            installment_number: inst.installment_number,
            value: inst.value,
            due_date: inst.due_date,
            barcode: inst.barcode || null,
            pix_key: inst.pix_key || null,
          })),
        },
      },
      include: INCLUDE_RELATIONS,
    })
  }

  async findById(id: string): Promise<PayableExpenseWithRelations | null> {
    return prisma.payableExpense.findUnique({ where: { id }, include: INCLUDE_RELATIONS })
  }

  async findByMaintenanceId(maintenanceId: string): Promise<PayableExpenseWithRelations[]> {
    return prisma.payableExpense.findMany({
      where: { maintenanceId, is_active: true },
      include: INCLUDE_RELATIONS,
      orderBy: { created_at: 'desc' },
    })
  }

  async findPendingByStatus(status: string): Promise<PayableExpenseWithRelations[]> {
    return prisma.payableExpense.findMany({
      where: { status: status as any, is_active: true },
      include: INCLUDE_RELATIONS,
      orderBy: { created_at: 'asc' },
    })
  }

  async findAll(
    page: number,
    status?: string,
    filters?: { month?: number; year?: number; search?: string },
  ): Promise<{ data: PayableExpenseWithRelations[]; total: number }> {
    const where: any = {
      is_active: true,
      ...(status ? { status: status as any } : {}),
    }

    // Period filter based on installment due dates
    if (filters?.month && filters?.year) {
      const startDate = new Date(filters.year, filters.month - 1, 1)
      const endDate = new Date(filters.year, filters.month, 0, 23, 59, 59, 999)
      where.installments = {
        some: {
          due_date: { gte: startDate, lte: endDate },
        },
      }
    }

    if (filters?.search) {
      where.OR = [
        { description: { contains: filters.search, mode: 'insensitive' } },
        { supplier: { company_name: { contains: filters.search, mode: 'insensitive' } } },
      ]
    }

    const [data, total] = await Promise.all([
      prisma.payableExpense.findMany({
        where,
        include: INCLUDE_RELATIONS,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.payableExpense.count({ where }),
    ])
    return { data, total }
  }

  async getSummary(month: number, year: number): Promise<ExpenseSummary> {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59, 999)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayEnd = new Date(today)
    todayEnd.setHours(23, 59, 59, 999)

    const installments = await prisma.expenseInstallment.findMany({
      where: {
        due_date: { gte: startDate, lte: endDate },
        payableExpense: { is_active: true },
      },
    })

    let overdue = 0
    let due_today = 0
    let upcoming = 0
    let paid = 0

    for (const inst of installments) {
      const value = Number(inst.value)
      if (inst.status === 'PAID') {
        paid += value
      } else if (inst.due_date < today) {
        overdue += value
      } else if (inst.due_date >= today && inst.due_date <= todayEnd) {
        due_today += value
      } else {
        upcoming += value
      }
    }

    return {
      overdue,
      due_today,
      upcoming,
      paid,
      total: overdue + due_today + upcoming + paid,
    }
  }

  async updateStatus(
    id: string,
    data: Prisma.PayableExpenseUpdateInput,
  ): Promise<PayableExpense> {
    return prisma.payableExpense.update({ where: { id }, data })
  }

  async update(
    id: string,
    data: { description?: string, payment_method?: 'BOLETO' | 'PIX' | 'TRANSFERENCIA' | 'CHEQUE' | 'DINHEIRO' | 'CARTAO', supplierId?: string | null, contractId?: string | null, chartOfAccountId?: string | null },
  ): Promise<PayableExpenseWithRelations> {
    return prisma.payableExpense.update({
      where: { id },
      data: {
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.supplierId !== undefined ? { supplierId: data.supplierId || null } : {}),
        ...(data.contractId !== undefined ? { contractId: data.contractId || null } : {}),
        ...(data.chartOfAccountId !== undefined ? { chartOfAccountId: data.chartOfAccountId || null } : {}),
        ...(data.payment_method !== undefined ? { payment_method: data.payment_method } : {}),
      },
      include: INCLUDE_RELATIONS,
    })
  }

  async findInstallmentById(id: string): Promise<ExpenseInstallment | null> {
    return prisma.expenseInstallment.findUnique({ where: { id } })
  }

  async updateInstallmentStatus(
    id: string,
    status: 'PENDING' | 'SCHEDULED' | 'PAID' | 'CANCELLED',
    payment_date?: Date,
  ): Promise<ExpenseInstallment> {
    return prisma.expenseInstallment.update({
      where: { id },
      data: { status, ...(payment_date ? { payment_date } : {}) },
    })
  }

  async scheduleInstallment(id: string, bankAccountId: string | null, pix_key?: string | null, barcode?: string | null): Promise<ExpenseInstallment> {
    return prisma.expenseInstallment.update({
      where: { id },
      data: { 
        status: bankAccountId ? 'SCHEDULED' : 'PENDING',
        scheduledBankAccountId: bankAccountId,
        ...(pix_key !== undefined && { pix_key }),
        ...(barcode !== undefined && { barcode }),
      },
    })
  }

  async findDocumentsByMaintenanceId(maintenanceId: string): Promise<ExpenseDocument[]> {
    return prisma.expenseDocument.findMany({
      where: {
        payableExpense: {
          maintenanceId,
        },
      },
      orderBy: { created_at: 'desc' },
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
    return prisma.expenseDocument.create({
      data: {
        payableExpenseId: data.payableExpenseId,
        filename: data.filename,
        original_name: data.original_name,
        file_path: data.file_path,
        file_size: data.file_size,
        mime_type: data.mime_type,
        document_type: data.document_type || null,
        description: data.description || null,
      },
    })
  }
}
