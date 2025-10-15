import { Prisma, Supplier } from '../../generated/prisma'
import { PaginatedResult } from './IPaginatedResult'

export interface ISupplierRepository {
  create(data: Prisma.SupplierCreateInput): Promise<Supplier>
  findById(id: string): Promise<Supplier | null>

  updateSupplier(
    id: string,
    data: Prisma.SupplierUpdateInput,
  ): Promise<Supplier>

  findByCompanyName(
    page: number,
    query: string,
  ): Promise<PaginatedResult<Supplier>>
  findAll(page: number): Promise<PaginatedResult<Supplier>>
  // findByServiceType(
  //   serviceType: string,
  //   page: number,
  // ): Promise<PaginatedResult<Supplier>>
}
