import { Supplier } from '../../generated/prisma'
import { ISupplierRepository } from '../../repositories/interfaces/ISupplierRepository'

interface FindByCompanyNameRequest {
  page: number
  query: string
}

interface FindByCompanyNameResponse {
  supplier: Supplier[]
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export class FindByCompanyNameUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute({
    page,
    query,
  }: FindByCompanyNameRequest): Promise<FindByCompanyNameResponse> {
    const { items, currentPage, pageSize, totalItems, totalPages } =
      await this.supplierRepository.findByCompanyName(page, query)

    return {
      supplier: items,
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    }
  }
}
