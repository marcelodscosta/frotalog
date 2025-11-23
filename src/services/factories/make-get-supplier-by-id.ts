import { PrismaSupplierRepository } from '../../repositories/prisma/prisma-supplier-repository'
import { FindSupplierByIdUseCase } from '../supplier/find-by-id-use-case'

export function makeGetSupplierById() {
  const supplierRepository = new PrismaSupplierRepository()
  const getSupplierByIdUseCase = new FindSupplierByIdUseCase(supplierRepository)
  return getSupplierByIdUseCase
}
