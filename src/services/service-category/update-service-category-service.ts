import { ServiceCategory } from '../../generated/prisma'
import { IServiceCategoryRepository } from '../../repositories/interfaces/IServiceCategoryRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface UpdateServiceCategoryRequest {
  id: string
  name?: string
  description?: string
}

interface UpdateServiceCategoryResponse {
  serviceCategory: ServiceCategory
}

export class UpdateServiceCategoryService {
  constructor(private serviceCategoryRepository: IServiceCategoryRepository) {}

  async execute(
    request: UpdateServiceCategoryRequest,
  ): Promise<UpdateServiceCategoryResponse> {
    const { id, name, description } = request

    const serviceCategoryExists =
      await this.serviceCategoryRepository.findById(id)

    if (!serviceCategoryExists) {
      throw new ResourceNotFoundError()
    }

    const serviceCategory =
      await this.serviceCategoryRepository.updateServiceCategory(id, {
        name,
        description,
      })

    return {
      serviceCategory,
    }
  }
}
