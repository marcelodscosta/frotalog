import { PrismaSupplierRepository } from '../../repositories/prisma/prisma-supplier-repository'
import { UpdateSupplierActiveStatusUseCase } from '../supplier/update-supplier-active-status.use-case'

export function makeUpdateSupplierIsActiveStatus() {
  const assetSupplierRepository = new PrismaSupplierRepository()
  const updateSupplierActiveStatusUseCase =
    new UpdateSupplierActiveStatusUseCase(assetSupplierRepository)
  return updateSupplierActiveStatusUseCase
}
