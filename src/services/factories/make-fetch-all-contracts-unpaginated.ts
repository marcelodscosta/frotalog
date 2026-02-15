import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { FetchAllContractsUnpaginatedUseCase } from '../contract/fetch-all-contract-unpaginated.use-case'

export function makeFetchAllContractsUnpaginated() {
  const contractRepository = new PrismaContractRepository()
  const fetchAllContractsUnpaginatedUseCase =
    new FetchAllContractsUnpaginatedUseCase(contractRepository)

  return fetchAllContractsUnpaginatedUseCase
}
