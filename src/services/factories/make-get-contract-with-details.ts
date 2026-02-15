import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { GetContractWithDetailsUseCase } from '../contract/get-contract-with-details-use-case'

export function makeGetContractWithDetails() {
  const contractRepository = new PrismaContractRepository()
  const getContractWithDetailsUseCase = new GetContractWithDetailsUseCase(
    contractRepository,
  )

  return getContractWithDetailsUseCase
}
