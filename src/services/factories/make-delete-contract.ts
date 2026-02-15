import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { DeleteContractUseCase } from '../contract/delete-contract-use-case'

export function makeDeleteContract() {
  const contractRepository = new PrismaContractRepository()
  const deleteContractUseCase = new DeleteContractUseCase(contractRepository)
  return deleteContractUseCase
}
