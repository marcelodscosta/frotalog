import { ISupplierRepository } from '../../repositories/interfaces/ISupplierRepository'
import { SupplierExistError } from '../errors/supplier-exist-error'

interface FindSupplierByCnpjRequest {
  cnpj: string
}

interface FindSupplierByCnpjResponse {
  supplierExist: boolean
}

export class FindSupplierByCnpjUseCase {
  constructor(private supplierRepository: ISupplierRepository) {}

  async execute({
    cnpj,
  }: FindSupplierByCnpjRequest): Promise<FindSupplierByCnpjResponse> {
    const supplierExist = await this.supplierRepository.findByCNPJ(cnpj)
    if (supplierExist) {
      throw new SupplierExistError()
    }
    return { supplierExist }
  }
}
