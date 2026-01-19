import { PrismaServiceCategoryRepository } from '../../repositories/prisma/prisma-service-category-repository'
import { FindAllServiceCategoryUnpaginatedService } from '../service-category/find-all-service-category-unpaginated-service'

export function makeFindAllServiceCategoryUnpaginated() {
  const serviceCategoryRepository = new PrismaServiceCategoryRepository()
  const findAllServiceCategoryUnpaginatedUseCase =
    new FindAllServiceCategoryUnpaginatedService(serviceCategoryRepository)
  return findAllServiceCategoryUnpaginatedUseCase
}
