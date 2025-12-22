import { PrismaSupplierRepository } from '../../repositories/prisma/prisma-supplier-repository'
import { FindAllUnpaginatedSupplierUseCase } from '../supplier/find-all-supplier-unpaginated-use-case'

export function makeFindAllUnpaginatedSupplier() {
  const assetRepository = new PrismaSupplierRepository()
  const findAllSupplierUnpaginatedUseCase =
    new FindAllUnpaginatedSupplierUseCase(assetRepository)
  return findAllSupplierUnpaginatedUseCase
}
