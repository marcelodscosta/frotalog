import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { PrismaSupplierRepository } from '../../repositories/prisma/prisma-supplier-repository'
import { CreateContractUseCase } from '../contract/create-contract-use-case'

export function makeCreateContract() {
  const contractRepository = new PrismaContractRepository()
  const supplierRepository = new PrismaSupplierRepository()
  const createContractUseCase = new CreateContractUseCase(
    contractRepository,
    supplierRepository,
  )
  return createContractUseCase
}
