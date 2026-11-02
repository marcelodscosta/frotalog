import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

export interface GetContractFinancialSummaryUseCaseRequest {
  contractId: string
}

export interface GetContractFinancialSummaryUseCaseResponse {
  financialSummary: {
    contractedValue: number
    measuredValue: number
    invoicedValue: number
    receivedValue: number
    totalMaintenanceCost: number
    totalOtherExpenses: number
    totalBulletinsValue: number
    balance: number
  }
}

export class GetContractFinancialSummaryUseCase {
  constructor(private contractRepository: IContractRepository) {}

  async execute({
    contractId,
  }: GetContractFinancialSummaryUseCaseRequest): Promise<GetContractFinancialSummaryUseCaseResponse> {
    const contract = await this.contractRepository.findById(contractId)

    if (!contract) {
      throw new ResourceNotFoundError()
    }

    const summary = await this.contractRepository.getFinancialSummary(contractId)
    
    const totalMaintenanceCost = summary?.totalMaintenanceCost || 0
    const totalOtherExpenses = summary?.totalOtherExpenses || 0
    const totalContractValue = contract.total_value ? Number(contract.total_value) : 0
    const totalBulletinsValue = summary?.totalBulletinsValue || 0
    const totalInvoicedValue = summary?.totalInvoicedValue || 0
    const totalReceivedValue = summary?.totalReceivedValue || 0

    return {
      financialSummary: {
        contractedValue: totalContractValue,
        measuredValue: totalBulletinsValue,
        invoicedValue: totalInvoicedValue,
        receivedValue: totalReceivedValue,
        totalBulletinsValue,
        totalMaintenanceCost,
        totalOtherExpenses,
        balance: totalBulletinsValue - (totalMaintenanceCost + totalOtherExpenses),
      },
    }
  }
}
