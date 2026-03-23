import { CommercialProposal, Prisma } from '../../generated/prisma'
import { ICommercialProposalRepository } from '../../repositories/interfaces/ICommercialProposalRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface UpdateProposalItem {
  assetId?: string | null
  assetCategoryId?: string | null
  description?: string
  unit?: string
  quantity: number
  monthly_value: number
  franchise_hours?: number
}

interface UpdateCommercialProposalRequest {
  id: string
  proposal_number: string
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
  status?: string
  items?: UpdateProposalItem[]
}

export class UpdateCommercialProposalUseCase {
  constructor(private proposalRepository: ICommercialProposalRepository) {}

  async execute(data: UpdateCommercialProposalRequest): Promise<{ proposal: CommercialProposal }> {
    const proposal = await this.proposalRepository.findById(data.id)
    if (!proposal) {
      throw new ResourceNotFoundError()
    }

    const inputData: Prisma.CommercialProposalUpdateInput = {
      proposal_number: data.proposal_number,
      client: { connect: { id: data.clientId } },
      companySettings: data.companySettingsId ? { connect: { id: data.companySettingsId } } : undefined,
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
      status: data.status as any,
    }

    if (data.items) {
      inputData.items = {
        deleteMany: {},
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

    const updatedProposal = await this.proposalRepository.updateProposal(data.id, inputData)
    return { proposal: updatedProposal }
  }
}
