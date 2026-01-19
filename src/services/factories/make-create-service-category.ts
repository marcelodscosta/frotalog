import { PrismaServiceCategoryRepository } from '../../repositories/prisma/prisma-service-category-repository'
import { CreateServiceCategoryService } from '../service-category/create-service-category-service'

export function makeCreateServiceCategory() {
  const serviceCategoryRepository = new PrismaServiceCategoryRepository()
  const createServiceCategoryUseCase = new CreateServiceCategoryService(
    serviceCategoryRepository,
  )
  return createServiceCategoryUseCase
}
