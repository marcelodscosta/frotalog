import { IBankAccountRepository } from '../../repositories/interfaces/IBankAccountRepository'
import { IFinancialTransactionRepository } from '../../repositories/interfaces/IFinancialTransactionRepository'
import { IPayableExpenseRepository } from '../../repositories/interfaces/IPayableExpenseRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface DeletePayableExpenseRequest {
  expenseId: string
}

export class DeletePayableExpenseUseCase {
  constructor(
    private payableExpenseRepository: IPayableExpenseRepository,
    private bankAccountRepository: IBankAccountRepository,
    private financialTransactionRepository: IFinancialTransactionRepository,
  ) {}

  async execute({ expenseId }: DeletePayableExpenseRequest) {
    const expense = await this.payableExpenseRepository.findById(expenseId)
    if (!expense) {
      throw new ResourceNotFoundError()
    }

    // Process installments to reverse payments if any
    for (const installment of (expense as any).installments) {
      // Check for transactions linked to this installment
      if (installment.transactions && installment.transactions.length > 0) {
        for (const transaction of installment.transactions) {
          // Delete the financial transaction record
          // The repository's delete method automatically recalculates the bank account balance
          await this.financialTransactionRepository.delete(transaction.id)
        }
      }
    }

    // Logical delete of the expense (sets is_active to false)
    await this.payableExpenseRepository.updateStatus(expenseId, { is_active: false })
  }
}
