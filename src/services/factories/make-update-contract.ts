import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { PrismaSupplierRepository } from '../../repositories/prisma/prisma-supplier-repository'
import { UpdateContractUseCase } from '../contract/update-contract-use-case'

export function makeUpdateContract() {
  const contractRepository = new PrismaContractRepository()
  const supplierRepository = new PrismaSupplierRepository()
  const updateContractUseCase = new UpdateContractUseCase(
    contractRepository,
    supplierRepository,
  )
  return updateContractUseCase
}
