import { CompanySettings, Prisma } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { ICompanySettingsRepository } from '../interfaces/ICompanySettingsRepository'

export class PrismaCompanySettingsRepository
  implements ICompanySettingsRepository
{
  async findFirst(): Promise<CompanySettings | null> {
    return prisma.companySettings.findFirst()
  }

  async upsert(
    data: Prisma.CompanySettingsCreateInput,
  ): Promise<CompanySettings> {
    const existing = await prisma.companySettings.findFirst()

    if (existing) {
      return prisma.companySettings.update({
        where: { id: existing.id },
        data,
      })
    }

    return prisma.companySettings.create({ data })
  }
}
