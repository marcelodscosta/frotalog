import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

export interface GetContractFinancialSummaryUseCaseRequest {
  contractId: string
}

export interface GetContractFinancialSummaryUseCaseResponse {
  financialSummary: {
    totalContractValue: number
    totalMaintenanceCost: number
    totalOtherExpenses: number
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
    const balance = totalContractValue - (totalMaintenanceCost + totalOtherExpenses)

    return {
      financialSummary: {
        totalContractValue,
        totalMaintenanceCost,
        totalOtherExpenses,
        balance,
      },
    }
  }
}
