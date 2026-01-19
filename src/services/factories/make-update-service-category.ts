import { PrismaServiceCategoryRepository } from '../../repositories/prisma/prisma-service-category-repository'
import { UpdateServiceCategoryService } from '../service-category/update-service-category-service'

export function makeUpdateServiceCategory() {
  const serviceCategoryRepository = new PrismaServiceCategoryRepository()
  const updateServiceCategoryUseCase = new UpdateServiceCategoryService(
    serviceCategoryRepository,
  )
  return updateServiceCategoryUseCase
}
