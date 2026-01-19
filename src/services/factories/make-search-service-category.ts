import { PrismaServiceCategoryRepository } from '../../repositories/prisma/prisma-service-category-repository'
import { SearchServiceCategoryService } from '../service-category/search-service-category-service'

export function makeSearchServiceCategory() {
  const serviceCategoryRepository = new PrismaServiceCategoryRepository()
  const searchServiceCategoryUseCase = new SearchServiceCategoryService(
    serviceCategoryRepository,
  )
  return searchServiceCategoryUseCase
}
