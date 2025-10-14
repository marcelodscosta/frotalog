import { Supplier } from '../../generated/prisma'
import { ISupplierRepository } from '../../repositories/interfaces/ISupplierRepository'
import { SupplierNotFoundError } from '../errors/supplier-not-found-error'

interface FindSupplierByIdRequest {
  id: string
}

interface FindSupplierByIdResponse {
  supplier: Supplier | null
}

export class FindSupplierByIdUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute({
    id,
  }: FindSupplierByIdRequest): Promise<FindSupplierByIdResponse> {
    const supplier = await this.supplierRepository.findById(id)
    if (!supplier) {
      throw new SupplierNotFoundError()
    }
    return { supplier }
  }
}
