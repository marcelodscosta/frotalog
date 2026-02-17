import { PrismaCompanySettingsRepository } from '../../repositories/prisma/prisma-company-settings-repository'
import { UpsertCompanySettingsUseCase } from '../company-settings/upsert-company-settings-use-case'

export function makeUpsertCompanySettings() {
  const repository = new PrismaCompanySettingsRepository()
  return new UpsertCompanySettingsUseCase(repository)
}
