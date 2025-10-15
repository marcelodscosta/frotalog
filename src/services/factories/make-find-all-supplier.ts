import { PrismaSupplierRepository } from '../../repositories/prisma/prisma-supplier-repository'
import { FindAllSupplierUseCase } from '../supplier/find-all-supplier-use-case'

export function makeFindAllSupplier() {
  const assetRepository = new PrismaSupplierRepository()
  const findAllSupplierUseCase = new FindAllSupplierUseCase(assetRepository)
  return findAllSupplierUseCase
}
