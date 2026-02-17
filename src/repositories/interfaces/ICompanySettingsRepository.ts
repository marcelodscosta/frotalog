import { CompanySettings, Prisma } from '../../generated/prisma'
import { PaginatedResult } from './IPaginatedResult'

export interface ICompanySettingsRepository {
  findFirst(): Promise<CompanySettings | null>
  upsert(data: Prisma.CompanySettingsCreateInput): Promise<CompanySettings>
}
