import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { GetContractFinancialSummaryUseCase } from '../contract/get-contract-financial-summary-use-case'

export function makeGetContractFinancialSummary() {
  const contractRepository = new PrismaContractRepository()
  const useCase = new GetContractFinancialSummaryUseCase(contractRepository)

  return useCase
}
