import {
  MeasurementBulletin,
  Prisma,
  MeasurementBulletinStatus,
} from '../../generated/prisma'
import { PaginatedResult } from './IPaginatedResult'

export interface IMeasurementBulletinRepository {
  create(
    data: Prisma.MeasurementBulletinUncheckedCreateInput,
  ): Promise<MeasurementBulletin>
  findById(id: string): Promise<MeasurementBulletin | null>
  findAll(page: number): Promise<PaginatedResult<MeasurementBulletin>>
  findAll(page: number): Promise<PaginatedResult<MeasurementBulletin>>
  findMany(options: {
    page: number
    status?: MeasurementBulletinStatus
    contractId?: string
    assetId?: string
  }): Promise<PaginatedResult<MeasurementBulletin>>
  findByContractId(
    contractId: string,
    page: number,
  ): Promise<PaginatedResult<MeasurementBulletin>>
  update(
    id: string,
    data: Prisma.MeasurementBulletinUpdateInput,
  ): Promise<MeasurementBulletin>
  delete(id: string): Promise<MeasurementBulletin>
  findByIdWithDetails(id: string): Promise<MeasurementBulletin | null>
}
