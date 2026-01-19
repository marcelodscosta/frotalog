import { IServiceCategoryRepository } from '../../repositories/interfaces/IServiceCategoryRepository'
import { PaginatedResult } from '../../repositories/interfaces/IPaginatedResult'
import { ServiceCategory } from '../../generated/prisma'

interface SearchServiceCategoryRequest {
  query: string
  page: number
}

export class SearchServiceCategoryService {
  constructor(private serviceCategoryRepository: IServiceCategoryRepository) {}

  async execute(
    request: SearchServiceCategoryRequest,
  ): Promise<PaginatedResult<ServiceCategory>> {
    const { query, page } = request

    const result = await this.serviceCategoryRepository.searchServiceCategory(
      query,
      page,
    )

    return result
  }
}
