import { PrismaSupplierRepository } from '../../repositories/prisma/prisma-supplier-repository'
import { UpdateSupplierUseCase } from '../supplier/update-supplier-use-case'

export function makeUpdateSupplier() {
  const assetSupplierRepository = new PrismaSupplierRepository()
  const updateSupplierUseCase = new UpdateSupplierUseCase(
    assetSupplierRepository,
  )
  return updateSupplierUseCase
}
