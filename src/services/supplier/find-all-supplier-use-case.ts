import { Supplier } from '../../generated/prisma'
import { ISupplierRepository } from '../../repositories/interfaces/ISupplierRepository'

interface FindAllSupplierUseCaseRequest {
  page: number
}

interface FindAllSupplierUseCaseResponse {
  supplier: Supplier[]
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export class FindAllSupplierUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute({
    page,
  }: FindAllSupplierUseCaseRequest): Promise<FindAllSupplierUseCaseResponse> {
    const { items, currentPage, pageSize, totalItems, totalPages } =
      await this.supplierRepository.findAll(page)
    return {
      supplier: items,
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    }
  }
}
