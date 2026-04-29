import { FastifyReply, FastifyRequest } from 'fastify'
import { makeLaunchExpense } from '../../../services/factories/make-launch-expense'
import { makeApproveExpense } from '../../../services/factories/make-approve-expense'
import { makeRejectExpense } from '../../../services/factories/make-reject-expense'
import { makeListPendingApprovals } from '../../../services/factories/make-list-pending-approvals'
import { makeListExpenses } from '../../../services/factories/make-list-expenses'
import { makePayInstallment } from '../../../services/factories/make-pay-installment'
import { makeScheduleInstallment } from '../../../services/factories/make-schedule-installment'
import { z } from 'zod'
import { ResourceNotFoundError } from '../../../services/errors/resource-not-found-error'

// ─── Launch Expense ───────────────────────────────────────────────────────────
export async function launchExpenseController(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    maintenanceId: z.string().uuid().optional(),
    contractId: z.string().uuid().optional(),
    chartOfAccountId: z.string().uuid().optional(),
    supplierId: z.string().uuid().optional(),
    description: z.string().min(1),
    total_value: z.number().positive(),
    payment_method: z.enum(['BOLETO', 'PIX', 'TRANSFERENCIA', 'CHEQUE', 'DINHEIRO', 'CARTAO']),
    installments: z.array(
      z.object({
        installment_number: z.number().int().min(1),
        value: z.number().positive(),
        due_date: z.coerce.date(),
        barcode: z.string().optional(),
        pix_key: z.string().optional(),
      })
    ).min(1),
  })

  const data = schema.parse(request.body)
  const useCase = makeLaunchExpense()
  const { expense } = await useCase.execute(data)
  return reply.status(201).send({ expense })
}

// ─── Update Expense (finance-only) ────────────────────────────────────────────
export async function updateExpenseController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const bodySchema = z.object({
    description: z.string().min(1).optional(),
    total_value: z.number().positive().optional(),
    supplierId: z.string().uuid().nullable().optional(),
    contractId: z.string().uuid().nullable().optional(),
    chartOfAccountId: z.string().uuid().nullable().optional(),
    payment_method: z.enum(['BOLETO', 'PIX', 'TRANSFERENCIA', 'CHEQUE', 'DINHEIRO', 'CARTAO']).optional(),
  })

  const { id } = paramsSchema.parse(request.params)
  const data = bodySchema.parse(request.body)

  const { PrismaPayableExpenseRepository } = await import('../../../repositories/prisma/prisma-payable-expense-repository')
  const repo = new PrismaPayableExpenseRepository()

  const existing = await repo.findById(id)
  if (!existing) return reply.status(404).send({ message: 'Expense not found' })

  const expense = await repo.update(id, {
    description: data.description,
    total_value: data.total_value,
    supplierId: data.supplierId !== undefined ? data.supplierId : undefined,
    contractId: data.contractId !== undefined ? data.contractId : undefined,
    chartOfAccountId: data.chartOfAccountId !== undefined ? data.chartOfAccountId : undefined,
    payment_method: data.payment_method,
  })

  return reply.send({ expense })
}

// ─── Delete Expense (finance-only) ────────────────────────────────────────────
export async function deleteExpenseController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const { id } = paramsSchema.parse(request.params)

  const { makeDeletePayableExpense } = await import('../../../services/factories/make-delete-payable-expense')
  const useCase = makeDeletePayableExpense()

  try {
    await useCase.execute({ expenseId: id })
    return reply.status(204).send()
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: 'Expense not found' })
    }
    return reply.status(500).send({ message: err.message })
  }
}

// ─── List Expenses ─────────────────────────────────────────────────────────────
export async function listExpensesController(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    status: z.string().optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
    year: z.coerce.number().int().min(2020).optional(),
    search: z.string().optional(),
  })
  const { page, status, month, year, search } = querySchema.parse(request.query)
  const useCase = makeListExpenses()
  const { expenses, total } = await useCase.execute({ page, status, filters: { month, year, search } })
  return reply.send({ expenses, total })
}

// ─── Expenses Summary ──────────────────────────────────────────────────────────
export async function getExpensesSummaryController(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    month: z.coerce.number().int().min(1).max(12),
    year: z.coerce.number().int().min(2020),
  })
  const { month, year } = querySchema.parse(request.query)

  const { PrismaPayableExpenseRepository } = await import('../../../repositories/prisma/prisma-payable-expense-repository')
  const repo = new PrismaPayableExpenseRepository()
  const summary = await repo.getSummary(month, year)
  return reply.send({ summary })
}

// ─── List by Maintenance ───────────────────────────────────────────────────────
export async function listExpensesByMaintenanceController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ maintenanceId: z.string().uuid() })
  const { maintenanceId } = paramsSchema.parse(request.params)
  const { PrismaPayableExpenseRepository } = await import('../../../repositories/prisma/prisma-payable-expense-repository')
  const repo = new PrismaPayableExpenseRepository()
  const expenses = await repo.findByMaintenanceId(maintenanceId)
  return reply.send({ expenses })
}

// ─── Approve Expense ──────────────────────────────────────────────────────────
export async function approveExpenseController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const bodySchema = z.object({
    approvedBy: z.string().min(1),
    level: z.enum(['MAINTENANCE', 'FINANCE', 'DIRECTOR']),
  })
  const { id } = paramsSchema.parse(request.params)
  const { approvedBy, level } = bodySchema.parse(request.body)

  try {
    const useCase = makeApproveExpense()
    const { expense } = await useCase.execute({ expenseId: id, approvedBy, level })
    return reply.send({ expense })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) return reply.status(404).send({ message: 'Expense not found' })
    return reply.status(409).send({ message: err.message })
  }
}

// ─── Reject Expense ───────────────────────────────────────────────────────────
export async function rejectExpenseController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const bodySchema = z.object({
    rejectedBy: z.string().min(1),
    notes: z.string().min(1),
  })
  const { id } = paramsSchema.parse(request.params)
  const { rejectedBy, notes } = bodySchema.parse(request.body)

  try {
    const useCase = makeRejectExpense()
    const { expense } = await useCase.execute({ expenseId: id, rejectedBy, notes })
    return reply.send({ expense })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) return reply.status(404).send({ message: 'Expense not found' })
    return reply.status(409).send({ message: err.message })
  }
}

// ─── List Pending Approvals ───────────────────────────────────────────────────
export async function listPendingApprovalsController(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    level: z.enum(['MAINTENANCE', 'FINANCE', 'DIRECTOR']),
  })
  const { level } = querySchema.parse(request.query)
  const useCase = makeListPendingApprovals()
  const { expenses } = await useCase.execute({ level })
  return reply.send({ expenses })
}

// ─── Pay Installment (Conciliation) ───────────────────────────────────────────
export async function payInstallmentController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ installmentId: z.string().uuid() })
  const bodySchema = z.object({
    bankAccountId: z.string().uuid(),
    payment_date: z.coerce.date(),
    receipt_url: z.string().url().optional(),
    description: z.string().optional(),
  })

  const { installmentId } = paramsSchema.parse(request.params)
  const data = bodySchema.parse(request.body)

  try {
    const useCase = makePayInstallment()
    const { transaction } = await useCase.execute({ installmentId, ...data })
    return reply.status(201).send({ transaction })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) return reply.status(404).send({ message: 'Installment or bank account not found' })
    return reply.status(409).send({ message: err.message })
  }
}

// ─── Schedule Installment ─────────────────────────────────────────────────────
export async function scheduleInstallmentController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const bodySchema = z.object({
    bankAccountId: z.string().uuid().nullable().optional(),
    pix_key: z.string().nullable().optional(),
    barcode: z.string().nullable().optional(),
  })

  const { id } = paramsSchema.parse(request.params)
  const data = bodySchema.parse(request.body)

  try {
    const useCase = makeScheduleInstallment()
    const { installment } = await useCase.execute({
      installmentId: id,
      bankAccountId: data.bankAccountId !== undefined ? data.bankAccountId : null,
      pix_key: data.pix_key,
      barcode: data.barcode,
    })
    return reply.send({ installment })
  } catch (err: any) {
    if (err instanceof ResourceNotFoundError) return reply.status(404).send({ message: 'Installment not found' })
    return reply.status(409).send({ message: err.message })
  }
}
