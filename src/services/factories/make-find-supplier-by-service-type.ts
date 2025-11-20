import { PrismaSupplierRepository } from '../../repositories/prisma/prisma-supplier-repository'
import { FindByServiceTypeUseCase } from '../supplier/find-by-service-type-use-case'

export function makeFindSupplierByServiceType() {
  const supplierRepository = new PrismaSupplierRepository()
  const findByServiceTypeUseCase = new FindByServiceTypeUseCase(
    supplierRepository,
  )
  return findByServiceTypeUseCase
}
