import { ServiceCategory } from '../../generated/prisma'
import { IServiceCategoryRepository } from '../../repositories/interfaces/IServiceCategoryRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface FindServiceCategoryByIdRequest {
  id: string
}

interface FindServiceCategoryByIdResponse {
  serviceCategory: ServiceCategory
}

export class FindServiceCategoryByIdService {
  constructor(private serviceCategoryRepository: IServiceCategoryRepository) {}

  async execute(
    request: FindServiceCategoryByIdRequest,
  ): Promise<FindServiceCategoryByIdResponse> {
    const { id } = request

    const serviceCategory = await this.serviceCategoryRepository.findById(id)

    if (!serviceCategory) {
      throw new ResourceNotFoundError()
    }

    return {
      serviceCategory,
    }
  }
}
