import { PayableExpense } from '../../generated/prisma'
import { IPayableExpenseRepository } from '../../repositories/interfaces/IPayableExpenseRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface RejectExpenseRequest {
  expenseId: string
  rejectedBy: string
  notes: string
}

export class RejectExpenseUseCase {
  constructor(private payableExpenseRepository: IPayableExpenseRepository) {}

  async execute(data: RejectExpenseRequest): Promise<{ expense: PayableExpense }> {
    const expense = await this.payableExpenseRepository.findById(data.expenseId)
    if (!expense) throw new ResourceNotFoundError()

    const isPending = [
      'PENDING_MAINTENANCE_APPROVAL',
      'PENDING_FINANCE_APPROVAL',
      'PENDING_DIRECTOR_APPROVAL',
    ].includes(expense.status)

    if (!isPending) {
      throw new Error('Expense cannot be rejected in its current status')
    }

    const updated = await this.payableExpenseRepository.updateStatus(data.expenseId, {
      status: 'REJECTED',
      rejection_notes: data.notes,
    })

    return { expense: updated }
  }
}
