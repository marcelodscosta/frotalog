import { PayableExpense } from '../../generated/prisma'
import { IPayableExpenseRepository } from '../../repositories/interfaces/IPayableExpenseRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

type ApprovalLevel = 'MAINTENANCE' | 'FINANCE' | 'DIRECTOR'

interface ApproveExpenseRequest {
  expenseId: string
  approvedBy: string // user id or name
  level: ApprovalLevel
}

const STATUS_MAP: Record<ApprovalLevel, string> = {
  MAINTENANCE: 'PENDING_FINANCE_APPROVAL',
  FINANCE: 'PENDING_DIRECTOR_APPROVAL',
  DIRECTOR: 'APPROVED',
}

const FIELD_MAP: Record<ApprovalLevel, { whoField: string; whenField: string }> = {
  MAINTENANCE: { whoField: 'maintenance_approved_by', whenField: 'maintenance_approved_at' },
  FINANCE: { whoField: 'finance_approved_by', whenField: 'finance_approved_at' },
  DIRECTOR: { whoField: 'director_approved_by', whenField: 'director_approved_at' },
}

const REQUIRED_CURRENT_STATUS: Record<ApprovalLevel, string> = {
  MAINTENANCE: 'PENDING_MAINTENANCE_APPROVAL',
  FINANCE: 'PENDING_FINANCE_APPROVAL',
  DIRECTOR: 'PENDING_DIRECTOR_APPROVAL',
}

export class ApproveExpenseUseCase {
  constructor(private payableExpenseRepository: IPayableExpenseRepository) {}

  async execute(data: ApproveExpenseRequest): Promise<{ expense: PayableExpense }> {
    const expense = await this.payableExpenseRepository.findById(data.expenseId)
    if (!expense) throw new ResourceNotFoundError()

    if (expense.status !== REQUIRED_CURRENT_STATUS[data.level]) {
      throw new Error(`Expense is not awaiting ${data.level} approval`)
    }

    const { whoField, whenField } = FIELD_MAP[data.level]
    const nextStatus = STATUS_MAP[data.level]

    const updated = await this.payableExpenseRepository.updateStatus(data.expenseId, {
      status: nextStatus as any,
      [whoField]: data.approvedBy,
      [whenField]: new Date(),
    })

    return { expense: updated }
  }
}
