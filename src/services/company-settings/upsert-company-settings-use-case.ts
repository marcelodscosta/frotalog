import { CompanySettings } from '../../generated/prisma'
import { ICompanySettingsRepository } from '../../repositories/interfaces/ICompanySettingsRepository'

interface UpsertCompanySettingsRequest {
  company_name: string
  trading_name?: string | null
  cnpj?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zip_code?: string | null
  phone?: string | null
  email?: string | null
  logo_url?: string | null
  invoice_start_number?: number
}

interface UpsertCompanySettingsResponse {
  companySettings: CompanySettings
}

export class UpsertCompanySettingsUseCase {
  constructor(
    private companySettingsRepository: ICompanySettingsRepository,
  ) {}

  async execute(
    data: UpsertCompanySettingsRequest,
  ): Promise<UpsertCompanySettingsResponse> {
    const companySettings = await this.companySettingsRepository.upsert({
      company_name: data.company_name,
      trading_name: data.trading_name,
      cnpj: data.cnpj,
      address: data.address,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code,
      phone: data.phone,
      email: data.email,
      logo_url: data.logo_url,
      invoice_start_number: data.invoice_start_number,
    })

    return { companySettings }
  }
}
