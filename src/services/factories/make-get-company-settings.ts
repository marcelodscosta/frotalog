import { PrismaCompanySettingsRepository } from '../../repositories/prisma/prisma-company-settings-repository'
import { GetCompanySettingsUseCase } from '../company-settings/get-company-settings-use-case'

export function makeGetCompanySettings() {
  const repository = new PrismaCompanySettingsRepository()
  return new GetCompanySettingsUseCase(repository)
}
