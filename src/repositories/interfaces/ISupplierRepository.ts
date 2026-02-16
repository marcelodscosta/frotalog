import { Prisma, Supplier } from '../../generated/prisma'
import { PaginatedResult } from './IPaginatedResult'

export interface ISupplierRepository {
  create(data: Prisma.SupplierCreateInput): Promise<Supplier>
  findById(id: string): Promise<Supplier | null>

  updateSupplier(
    id: string,
    data: Prisma.SupplierUpdateInput,
  ): Promise<Supplier>

  updateSupplierIsActive(id: string, data: boolean): Promise<Supplier>

  findByCompanyName(
    page: number,
    query: string,
  ): Promise<PaginatedResult<Supplier>>
  findAll(page: number): Promise<PaginatedResult<Supplier>>

  findByServiceType(
    serviceType: string,
    page: number,
  ): Promise<PaginatedResult<Supplier>>

  findByCNPJ(cnpj: string): Promise<boolean>

  findAllUnpaginated(): Promise<Supplier[]>
  findAllClientsUnpaginated(): Promise<Supplier[]>
}
