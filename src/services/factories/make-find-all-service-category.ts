import { PrismaServiceCategoryRepository } from '../../repositories/prisma/prisma-service-category-repository'
import { FindAllServiceCategoryService } from '../service-category/find-all-service-category-service'

export function makeFindAllServiceCategory() {
  const serviceCategoryRepository = new PrismaServiceCategoryRepository()
  const findAllServiceCategoryUseCase = new FindAllServiceCategoryService(
    serviceCategoryRepository,
  )
  return findAllServiceCategoryUseCase
}
