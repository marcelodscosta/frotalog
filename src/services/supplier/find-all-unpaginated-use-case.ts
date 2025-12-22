import { Supplier } from '../../generated/prisma'
import { ISupplierRepository } from '../../repositories/interfaces/ISupplierRepository'

interface FindAllUnpaginatedSupplierUseCaseResponse {
  supplier: Supplier[]
}

export class FindAllUnpaginatedSupplierUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(): Promise<FindAllUnpaginatedSupplierUseCaseResponse> {
    const supplier = await this.supplierRepository.findAllUnpaginated()
    return {
      supplier,
    }
  }
}
