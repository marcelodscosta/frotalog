import { CommercialProposal, Prisma } from '../../generated/prisma'
import { ICommercialProposalRepository } from '../../repositories/interfaces/ICommercialProposalRepository'
import { ProposalAlreadyExistsError } from '../errors/proposal-already-exists-error'
import { ICompanySettingsRepository } from '../../repositories/interfaces/ICompanySettingsRepository'

interface CreateProposalItem {
  assetId?: string
  assetCategoryId?: string
  description?: string
  unit?: string
  quantity: number
  monthly_value: number
  franchise_hours?: number
}

interface CreateCommercialProposalRequest {
  proposal_number?: string
  clientId: string
  companySettingsId?: string
  contact_name?: string
  contact_phone?: string
  contact_email?: string
  mobilization_value?: number
  demobilization_value?: number
  payment_conditions?: string
  rental_period?: string
  technical_notes?: string
  observations?: string
  validity_days?: number
  body_html?: string
  items?: CreateProposalItem[]
}

export class CreateCommercialProposalUseCase {
  constructor(
    private proposalRepository: ICommercialProposalRepository,
    private companySettingsRepository: ICompanySettingsRepository,
  ) {}

  async execute(data: CreateCommercialProposalRequest): Promise<{ proposal: CommercialProposal }> {
    let proposal_number = data.proposal_number

    if (!proposal_number || proposal_number === 'AUTO') {
      const settings = await this.companySettingsRepository.findFirst()
      const startNumber = settings?.proposal_start_number || 1
      const currentYear = new Date().getFullYear()
      
      const count = await this.proposalRepository.countAll()
      const sequence = Math.max(count + 1, startNumber).toString().padStart(4, '0')
      proposal_number = `PROP-${currentYear}-${sequence}`
    }

    const existing = await this.proposalRepository.findByProposalNumber(proposal_number)
    if (existing) {
      throw new ProposalAlreadyExistsError()
    }

    const inputData: Prisma.CommercialProposalUncheckedCreateInput = {
      proposal_number,
      clientId: data.clientId,
      companySettingsId: data.companySettingsId,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone,
      contact_email: data.contact_email,
      mobilization_value: data.mobilization_value,
      demobilization_value: data.demobilization_value,
      payment_conditions: data.payment_conditions,
      rental_period: data.rental_period,
      technical_notes: data.technical_notes,
      observations: data.observations,
      validity_days: data.validity_days,
      body_html: data.body_html,
    }

    if (data.items && data.items.length > 0) {
      inputData.items = {
        create: data.items.map(item => ({
          assetId: item.assetId,
          assetCategoryId: item.assetCategoryId,
          description: item.description,
          unit: item.unit,
          quantity: item.quantity,
          monthly_value: item.monthly_value,
          franchise_hours: item.franchise_hours,
        }))
      }
    }

    const proposal = await this.proposalRepository.create(inputData)
    return { proposal }
  }
}
