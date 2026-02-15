import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { GetContractByIdUseCase } from '../contract/get-contract-by-id-use-case'

export function makeGetContract() {
  const contractRepository = new PrismaContractRepository()
  const getContractByIdUseCase = new GetContractByIdUseCase(contractRepository)
  return getContractByIdUseCase
}
