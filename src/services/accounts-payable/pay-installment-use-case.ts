import { IBankAccountRepository } from '../../repositories/interfaces/IBankAccountRepository'
import { IFinancialTransactionRepository } from '../../repositories/interfaces/IFinancialTransactionRepository'
import { IPayableExpenseRepository } from '../../repositories/interfaces/IPayableExpenseRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface PayInstallmentRequest {
  installmentId: string
  bankAccountId: string
  payment_date: Date
  receipt_url?: string
  description?: string
}

export class PayInstallmentUseCase {
  constructor(
    private payableExpenseRepository: IPayableExpenseRepository,
    private bankAccountRepository: IBankAccountRepository,
    private financialTransactionRepository: IFinancialTransactionRepository,
  ) {}

  async execute(data: PayInstallmentRequest) {
    const installment = await this.payableExpenseRepository.findInstallmentById(data.installmentId)
    if (!installment) throw new ResourceNotFoundError()

    if (installment.status === 'PAID') {
      throw new Error('Installment is already paid')
    }

    const bankAccount = await this.bankAccountRepository.findById(data.bankAccountId)
    if (!bankAccount) throw new ResourceNotFoundError()

    // Mark the installment as paid
    await this.payableExpenseRepository.updateInstallmentStatus(
      data.installmentId,
      'PAID',
      data.payment_date,
    )

    // Debit the bank account
    await this.bankAccountRepository.updateBalance(data.bankAccountId, -Number(installment.value))

    // Get the parent expense to include in the description
    const expense = await this.payableExpenseRepository.findById(installment.payableExpenseId)
    const expenseSummary = expense?.description ? ` - ${expense.description}` : ''
    const osInfo = expense?.maintenanceId ? ` (OS ${expense.maintenanceId.slice(0, 6).toUpperCase()})` : ''

    // Record the financial transaction
    const transaction = await this.financialTransactionRepository.create({
      bankAccount: { connect: { id: data.bankAccountId } },
      type: 'EXPENSE',
      amount: installment.value,
      date: data.payment_date,
      description: data.description ?? `Pgto parc. ${installment.installment_number}${osInfo}${expenseSummary}`,
      receipt_url: data.receipt_url,
      expenseInstallment: { connect: { id: data.installmentId } },
    })

    // Update the parent expense status (check if all installments are paid)
    if (expense) {
      const allPaid = expense.installments.every(
        (inst) => inst.id === data.installmentId || inst.status === 'PAID',
      )
      if (allPaid) {
        await this.payableExpenseRepository.updateStatus(expense.id, { status: 'PAID' })
      } else {
        await this.payableExpenseRepository.updateStatus(expense.id, { status: 'PARTIALLY_PAID' })
      }
    }

    return { transaction }
  }
}
