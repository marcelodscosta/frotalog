import { CompanySettings } from '../../generated/prisma'
import { ICompanySettingsRepository } from '../../repositories/interfaces/ICompanySettingsRepository'

interface GetCompanySettingsResponse {
  companySettings: CompanySettings | null
}

export class GetCompanySettingsUseCase {
  constructor(
    private companySettingsRepository: ICompanySettingsRepository,
  ) {}

  async execute(): Promise<GetCompanySettingsResponse> {
    const companySettings = await this.companySettingsRepository.findFirst()
    return { companySettings }
  }
}
