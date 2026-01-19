import { ServiceCategory } from '../../generated/prisma'
import { IServiceCategoryRepository } from '../../repositories/interfaces/IServiceCategoryRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface UpdateServiceCategoryIsActiveRequest {
  id: string
  is_active: boolean
}

interface UpdateServiceCategoryIsActiveResponse {
  serviceCategory: ServiceCategory
}

export class UpdateServiceCategoryIsActiveService {
  constructor(private serviceCategoryRepository: IServiceCategoryRepository) {}

  async execute(
    request: UpdateServiceCategoryIsActiveRequest,
  ): Promise<UpdateServiceCategoryIsActiveResponse> {
    const { id, is_active } = request

    const serviceCategoryExists =
      await this.serviceCategoryRepository.findById(id)

    if (!serviceCategoryExists) {
      throw new ResourceNotFoundError()
    }

    const serviceCategory =
      await this.serviceCategoryRepository.updateServiceCategoryIsActive(
        id,
        is_active,
      )

    return {
      serviceCategory,
    }
  }
}
