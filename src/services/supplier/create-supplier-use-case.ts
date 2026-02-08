import { Supplier } from '../../generated/prisma'
import { ISupplierRepository } from '../../repositories/interfaces/ISupplierRepository'
import { SupplierExistError } from '../errors/supplier-exist-error'

interface CreateSupplierRequest {
  company_name: string
  trading_name?: string
  cnpj: string
  email: string
  phone: string
  contact: string
  isClient?: boolean
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
    const supplierExist = await this.supplierRepository.findByCNPJ(data.cnpj)
    if (supplierExist) {
      throw new SupplierExistError()
    }
    const supplier = await this.supplierRepository.create(data)
    return { supplier }
  }
}
