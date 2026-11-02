import { CommercialProposal, Prisma } from '../../generated/prisma'
import { ICommercialProposalRepository } from '../../repositories/interfaces/ICommercialProposalRepository'
import { AppError } from '../errors/app-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { ProposalStatus } from '../../generated/prisma'
import { assertProposalTransition } from './proposal-status-transitions'

interface UpdateProposalItem {
  assetId?: string | null
  assetCategoryId?: string | null
  description?: string
  unit?: string
  quantity: number
  monthly_value: number
  franchise_hours?: number
  extra_hour_value?: number | null
  notes?: string | null
}

interface UpdateCommercialProposalRequest {
  id: string
  proposal_number: string
  clientId: string
  userId?: string | null
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
  discount_percentage?: number
  discount_value?: number
  follow_up_date?: string | null
  commission_percentage?: number
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

    if (data.status === 'CONVERTED' && proposal.status !== 'CONVERTED') {
      throw new AppError('Use a ação "Gerar contrato" para converter uma proposta aprovada.', 400)
    }

    if (proposal.status === 'CONVERTED' && data.status && data.status !== 'CONVERTED') {
      throw new AppError('Uma proposta convertida não pode ter o status alterado.', 400)
    }

    if (data.status && data.status !== proposal.status) {
      assertProposalTransition(proposal.status, data.status as ProposalStatus)
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
      discount_percentage: data.discount_percentage,
      discount_value: data.discount_value,
      follow_up_date: data.follow_up_date === undefined
        ? undefined
        : data.follow_up_date === null
          ? null
          : new Date(data.follow_up_date),
      commission_percentage: data.commission_percentage,
      body_html: data.body_html,
      status: data.status as any,
      sent_at: data.status === 'SENT' ? new Date() : undefined,
      user: data.userId !== undefined
        ? (data.userId ? { connect: { id: data.userId } } : { disconnect: true })
        : undefined,
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
          extra_hour_value: item.extra_hour_value,
          notes: item.notes,
        }))
      }
    }

    const updatedProposal = await this.proposalRepository.updateProposal(data.id, inputData)
    return { proposal: updatedProposal }
  }
}
