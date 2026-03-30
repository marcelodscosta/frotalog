import { ExpenseInstallment } from '../../generated/prisma'
import { IPayableExpenseRepository } from '../../repositories/interfaces/IPayableExpenseRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface ScheduleInstallmentUseCaseRequest {
  installmentId: string
  bankAccountId: string | null
  pix_key?: string | null
  barcode?: string | null
}

interface ScheduleInstallmentUseCaseResponse {
  installment: ExpenseInstallment
}

export class ScheduleInstallmentUseCase {
  constructor(private payableExpenseRepository: IPayableExpenseRepository) {}

  async execute({
    installmentId,
    bankAccountId,
    pix_key,
    barcode,
  }: ScheduleInstallmentUseCaseRequest): Promise<ScheduleInstallmentUseCaseResponse> {
    const installment = await this.payableExpenseRepository.findInstallmentById(installmentId)

    if (!installment) {
      throw new ResourceNotFoundError()
    }

    if (installment.status === 'PAID') {
      throw new Error('Cannot schedule an already paid installment')
    }

    const updatedInstallment = await this.payableExpenseRepository.scheduleInstallment(
      installmentId,
      bankAccountId,
      pix_key,
      barcode
    )

    return {
      installment: updatedInstallment,
    }
  }
}
