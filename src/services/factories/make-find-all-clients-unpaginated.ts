import { PrismaSupplierRepository } from '../../repositories/prisma/prisma-supplier-repository'
import { FindAllClientsUnpaginatedUseCase } from '../supplier/find-all-clients-unpaginated-use-case'

export function makeFindAllClientsUnpaginated() {
  const supplierRepository = new PrismaSupplierRepository()
  const findAllClientsUnpaginatedUseCase =
    new FindAllClientsUnpaginatedUseCase(supplierRepository)
  return findAllClientsUnpaginatedUseCase
}
