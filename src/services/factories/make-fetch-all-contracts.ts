import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { FetchAllContractsUseCase } from '../contract/fetch-all-contracts-use-case'

export function makeFetchAllContracts() {
  const contractRepository = new PrismaContractRepository()
  const fetchAllContractsUseCase = new FetchAllContractsUseCase(
    contractRepository,
  )

  return fetchAllContractsUseCase
}
