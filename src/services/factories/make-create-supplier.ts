import { PrismaSupplierRepository } from '../../repositories/prisma/prisma-supplier-repository'
import { CreateSupplierUseCase } from '../supplier/create-supplier-use-case'

export function makeCreateSupplier() {
  const supplierRepository = new PrismaSupplierRepository()
  const createSupplierUseCase = new CreateSupplierUseCase(supplierRepository)
  return createSupplierUseCase
}
