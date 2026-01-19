import { IServiceCategoryRepository } from '../../repositories/interfaces/IServiceCategoryRepository'
import { PaginatedResult } from '../../repositories/interfaces/IPaginatedResult'
import { ServiceCategory } from '../../generated/prisma'

interface FindAllServiceCategoryRequest {
  page: number
}

export class FindAllServiceCategoryService {
  constructor(private serviceCategoryRepository: IServiceCategoryRepository) {}

  async execute(
    request: FindAllServiceCategoryRequest,
  ): Promise<PaginatedResult<ServiceCategory>> {
    const { page } = request

    const result = await this.serviceCategoryRepository.findAll(page)

    return result
  }
}
