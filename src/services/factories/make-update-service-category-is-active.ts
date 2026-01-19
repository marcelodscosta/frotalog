import { PrismaServiceCategoryRepository } from '../../repositories/prisma/prisma-service-category-repository'
import { UpdateServiceCategoryIsActiveService } from '../service-category/update-service-category-is-active-service'

export function makeUpdateServiceCategoryIsActive() {
  const serviceCategoryRepository = new PrismaServiceCategoryRepository()
  const updateServiceCategoryIsActiveUseCase =
    new UpdateServiceCategoryIsActiveService(serviceCategoryRepository)
  return updateServiceCategoryIsActiveUseCase
}
