import { ServiceCategory, Prisma } from '../../generated/prisma'
import { PaginatedResult } from './IPaginatedResult'

export interface IServiceCategoryRepository {
  create(
    data: Prisma.ServiceCategoryUncheckedCreateInput,
  ): Promise<ServiceCategory>

  findById(id: string): Promise<ServiceCategory | null>

  searchServiceCategory(
    query: string,
    page: number,
  ): Promise<PaginatedResult<ServiceCategory>>

  updateServiceCategory(
    id: string,
    data: Prisma.ServiceCategoryUpdateInput,
  ): Promise<ServiceCategory>

  updateServiceCategoryIsActive(
    id: string,
    is_active: boolean,
  ): Promise<ServiceCategory>

  findAll(page: number): Promise<PaginatedResult<ServiceCategory>>

  findAllUnpaginated(): Promise<ServiceCategory[]>
}
