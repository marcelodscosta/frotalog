import { Prisma, Supplier } from '../../generated/prisma'
import { ISupplierRepository } from '../../repositories/interfaces/ISupplierRepository'
import { SupplierNotFoundError } from '../errors/supplier-not-found-error'

interface UpdateSupplierRequest {
  id: string
  data: Prisma.SupplierUpdateInput
}

interface UpdateSupplierResponse {
  supplier: Supplier
}

export class UpdateSupplierUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute({
    id,
    data,
  }: UpdateSupplierRequest): Promise<UpdateSupplierResponse> {
    const existingSupplier = await this.supplierRepository.findById(id)
    if (!existingSupplier) {
      throw new SupplierNotFoundError()
    }
    const supplier = await this.supplierRepository.updateSupplier(id, data)
    return { supplier }
  }
}
