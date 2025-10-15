import { PrismaSupplierRepository } from '../../repositories/prisma/prisma-supplier-repository'
import { FindByCompanyNameUseCase } from '../supplier/find-by-company-name-use-case'

export function makeFindSupplierByCompanyName() {
  const supplierRepository = new PrismaSupplierRepository()
  const findSupplierByCompanyName = new FindByCompanyNameUseCase(
    supplierRepository,
  )
  return findSupplierByCompanyName
}
