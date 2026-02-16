import { Supplier } from '../../generated/prisma'
import { ISupplierRepository } from '../../repositories/interfaces/ISupplierRepository'

interface FindAllClientsUnpaginatedUseCaseResponse {
  clients: Supplier[]
}

export class FindAllClientsUnpaginatedUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(): Promise<FindAllClientsUnpaginatedUseCaseResponse> {
    const clients = await this.supplierRepository.findAllClientsUnpaginated()
    return {
      clients,
    }
  }
}
