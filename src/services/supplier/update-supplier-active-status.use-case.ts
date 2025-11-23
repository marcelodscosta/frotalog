import { Supplier } from '../../generated/prisma'
import { ISupplierRepository } from '../../repositories/interfaces/ISupplierRepository'
import { SupplierNotFoundError } from '../errors/supplier-not-found-error'

interface UpdateSupplierActiveStatusRequest {
  id: string
  data: boolean
}

interface UpdateSupplierActiveStatusResponse {
  supplier: Supplier
}

export class UpdateSupplierActiveStatusUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute({
    id,
    data,
  }: UpdateSupplierActiveStatusRequest): Promise<UpdateSupplierActiveStatusResponse> {
    const existingSupplier = await this.supplierRepository.findById(id)
    if (!existingSupplier) {
      throw new SupplierNotFoundError()
    }
    const supplier = await this.supplierRepository.updateSupplierIsActive(
      id,
      data,
    )
    return { supplier }
  }
}
