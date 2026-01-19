import { IServiceCategoryRepository } from '../../repositories/interfaces/IServiceCategoryRepository'
import { ServiceCategory } from '../../generated/prisma'

export class FindAllServiceCategoryUnpaginatedService {
  constructor(private serviceCategoryRepository: IServiceCategoryRepository) {}

  async execute(): Promise<{ serviceCategories: ServiceCategory[] }> {
    const serviceCategories =
      await this.serviceCategoryRepository.findAllUnpaginated()

    return {
      serviceCategories,
    }
  }
}
