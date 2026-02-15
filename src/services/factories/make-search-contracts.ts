// services/factories/make-search-contracts.ts
import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { SearchContractsUseCase } from '../contract/search-contract-use-case'

export function makeSearchContracts() {
  const contractRepository = new PrismaContractRepository()
  const searchContractsUseCase = new SearchContractsUseCase(contractRepository)
  return searchContractsUseCase
}
