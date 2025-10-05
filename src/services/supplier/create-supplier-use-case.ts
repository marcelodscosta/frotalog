import { Supplier } from '../../generated/prisma'
import { ISupplierRepository } from '../../repositories/interfaces/ISupplierRepository'

interface CreateSupplierRequest {
  company_name: string
  trading_name?: string
  cnpj: string
  email: string
  phone: string
  contact: string

  adrdress?: string
  city?: string
  state?: string
  zip_code?: string

  service_types: string[]
}

interface CreateSupplierResponse {
  supplier: Supplier
}

export class CreateSupplierUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute(data: CreateSupplierRequest): Promise<CreateSupplierResponse> {
    const supplier = await this.supplierRepository.create(data)
    return { supplier }
  }
}
