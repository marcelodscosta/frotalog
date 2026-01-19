import { PrismaServiceCategoryRepository } from '../../repositories/prisma/prisma-service-category-repository'
import { FindServiceCategoryByIdService } from '../service-category/find-service-category-by-id-service'

export function makeFindServiceCategoryById() {
  const serviceCategoryRepository = new PrismaServiceCategoryRepository()
  const findServiceCategoryByIdUseCase = new FindServiceCategoryByIdService(
    serviceCategoryRepository,
  )
  return findServiceCategoryByIdUseCase
}
