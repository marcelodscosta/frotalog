import { ExpenseInstallment, PayableExpense, Prisma } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import {
  CreateExpenseData,
  IPayableExpenseRepository,
  PayableExpenseWithRelations,
} from '../interfaces/IPayableExpenseRepository'

const INCLUDE_RELATIONS = {
  supplier: { select: { company_name: true, trading_name: true } },
  installments: { orderBy: { installment_number: 'asc' } as const },
  documents: true,
}

const PAGE_SIZE = 20

export class PrismaPayableExpenseRepository implements IPayableExpenseRepository {
  async create(data: CreateExpenseData): Promise<PayableExpenseWithRelations> {
    const { maintenanceId, supplierId, description, total_value, payment_method, installments } = data

    return prisma.payableExpense.create({
      data: {
        maintenanceId,
        supplierId: supplierId || null,
        description,
        total_value,
        payment_method,
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
  ): Promise<{ data: PayableExpenseWithRelations[]; total: number }> {
    const where = {
      is_active: true,
      ...(status ? { status: status as any } : {}),
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

  async updateStatus(
    id: string,
    data: Prisma.PayableExpenseUpdateInput,
  ): Promise<PayableExpense> {
    return prisma.payableExpense.update({ where: { id }, data })
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
}
