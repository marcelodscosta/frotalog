import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { IPayableExpenseRepository, PayableExpenseWithRelations } from '../../repositories/interfaces/IPayableExpenseRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface InstallmentInput {
  installment_number: number
  value: number
  due_date: Date
  barcode?: string
  pix_key?: string
}

interface LaunchExpenseRequest {
  maintenanceId: string
  supplierId?: string
  description: string
  total_value: number
  payment_method: 'BOLETO' | 'PIX' | 'TRANSFERENCIA' | 'CHEQUE' | 'DINHEIRO' | 'CARTAO'
  installments: InstallmentInput[]
}

interface LaunchExpenseResponse {
  expense: PayableExpenseWithRelations
}

export class LaunchExpenseUseCase {
  constructor(
    private payableExpenseRepository: IPayableExpenseRepository,
    private maintenanceRepository: IMaintenanceRepository,
  ) {}

  async execute(data: LaunchExpenseRequest): Promise<LaunchExpenseResponse> {
    const maintenance = await this.maintenanceRepository.findById(data.maintenanceId)
    if (!maintenance) throw new ResourceNotFoundError()

    if (!data.installments || data.installments.length === 0) {
      throw new Error('At least one installment is required')
    }

    const expense = await this.payableExpenseRepository.create({
      maintenanceId: data.maintenanceId,
      supplierId: data.supplierId,
      description: data.description,
      total_value: data.total_value,
      payment_method: data.payment_method,
      installments: data.installments,
    })

    return { expense }
  }
}
