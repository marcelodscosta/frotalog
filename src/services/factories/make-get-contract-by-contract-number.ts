import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { GetContractByNumberUseCase } from '../contract/get-contract-by-number'

export function makeGetContractByContractNumber() {
  const contractRepository = new PrismaContractRepository()
  const getContractByContractNumberUseCase = new GetContractByNumberUseCase(
    contractRepository,
  )
  return getContractByContractNumberUseCase
}
