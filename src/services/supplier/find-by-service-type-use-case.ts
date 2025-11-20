import { Supplier } from '../../generated/prisma'
import { ISupplierRepository } from '../../repositories/interfaces/ISupplierRepository'

interface FindByServiceTypeRequest {
  page: number
  serviceType: string
}

interface FindByServiceTypeResponse {
  supplier: Supplier[]
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export class FindByServiceTypeUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute({
    page,
    serviceType,
  }: FindByServiceTypeRequest): Promise<FindByServiceTypeResponse> {
    const { items, currentPage, pageSize, totalItems, totalPages } =
      await this.supplierRepository.findByServiceType(serviceType, page)

    return {
      supplier: items,
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    }
  }
}
