import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { FetchContractsByClientUseCase } from '../contract/fetch-contracts-by-client-use-case'

export function makeFetchContractsByClient() {
  const contractRepository = new PrismaContractRepository()
  const fetchContractsByClientUseCase = new FetchContractsByClientUseCase(
    contractRepository,
  )

  return fetchContractsByClientUseCase
}
