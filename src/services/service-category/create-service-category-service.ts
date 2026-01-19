import { ServiceCategory } from '../../generated/prisma'
import { IServiceCategoryRepository } from '../../repositories/interfaces/IServiceCategoryRepository'

interface CreateServiceCategoryRequest {
  name: string
  description?: string
}

interface CreateServiceCategoryResponse {
  serviceCategory: ServiceCategory
}

export class CreateServiceCategoryService {
  constructor(private serviceCategoryRepository: IServiceCategoryRepository) {}

  async execute(
    request: CreateServiceCategoryRequest,
  ): Promise<CreateServiceCategoryResponse> {
    const { name, description } = request

    const serviceCategory = await this.serviceCategoryRepository.create({
      name,
      description: description ?? null,
      is_active: true,
    })

    return {
      serviceCategory,
    }
  }
}
