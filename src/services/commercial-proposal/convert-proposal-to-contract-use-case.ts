import { Contract, ContractType } from '../../generated/prisma'
import { ICommercialProposalRepository } from '../../repositories/interfaces/ICommercialProposalRepository'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { ICompanySettingsRepository } from '../../repositories/interfaces/ICompanySettingsRepository'
import { ContractAlreadyExistsError } from '../errors/contract-already-exist-error'
import { AppError } from '../errors/app-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { ProposalNotApprovedError } from '../errors/proposal-not-approved-error'
import { buildSimpleContractHtml } from './simple-contract-template'
import { prisma } from '../../lib/prisma'

interface ConvertProposalToContractRequest {
  proposalId: string
  contract_number: string
  start_date: Date
  type?: ContractType
}

function parseRentalPeriodMonths(value?: string | null): number | null {
  if (!value) return null
  const match = value.match(/\d+/)
  if (!match) return null
  const months = Number(match[0])
  return months > 0 && months <= 240 ? months : null
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

export class ConvertProposalToContractUseCase {
  constructor(
    private proposalRepository: ICommercialProposalRepository,
    private contractRepository: IContractRepository,
    private companySettingsRepository: ICompanySettingsRepository
  ) {}

  async execute({ proposalId, contract_number, start_date, type = 'NORMAL' }: ConvertProposalToContractRequest): Promise<{ contract: Contract }> {
    const proposal = await this.proposalRepository.getProposalWithDetails(proposalId)

    if (!proposal) {
      throw new ResourceNotFoundError()
    }

    const linkedContract = (proposal as any).contract as { id: string } | null

    if (linkedContract) {
      throw new AppError('Esta proposta já possui um contrato vinculado.', 400)
    }

    // Propostas antigas podem estar marcadas como CONVERTED sem contrato vinculado.
    if (proposal.status !== 'APPROVED' && proposal.status !== 'CONVERTED') {
      throw new ProposalNotApprovedError()
    }

    const existingContract = await this.contractRepository.findByContractNumber(contract_number)
    if (existingContract) {
      throw new ContractAlreadyExistsError()
    }

    const details = proposal as any
    const items: Array<{
      assetId?: string | null
      quantity?: number | string
      monthly_value?: number | string
      franchise_hours?: number | null
      extra_hour_value?: number | string | null
      description?: string | null
      notes?: string | null
    }> = details.items ?? []
    const subtotal = items.reduce(
      (total, item) => total + Number(item.quantity || 0) * Number(item.monthly_value || 0),
      0,
    )
    const discountValue = Number(details.discount_value || 0)
    const discountPercentage = Number(details.discount_percentage || 0)
    const discount = discountValue > 0
      ? Math.min(discountValue, subtotal)
      : subtotal * (discountPercentage / 100)
    const mobilization = Number(details.mobilization_value || 0)
    const demobilization = Number(details.demobilization_value || 0)
    const totalValue = Math.max(subtotal - discount, 0) + mobilization + demobilization

    const rentalMonths = parseRentalPeriodMonths(proposal.rental_period)
    const endDate = rentalMonths ? addMonths(start_date, rentalMonths) : undefined

    // 1. Preparar o corpo do contrato com substituições se necessário
    let body_html = proposal.body_html
    if (body_html) {
      body_html = body_html.replace(/\[CONTRACT_NUMBER\]/g, contract_number)
      body_html = body_html.replace(/\[NÚMERO DO CONTRATO\]/g, contract_number)
      
      // Se o corpo contiver explicitamente AUTO (como visto em alguns casos), substituir pelo número real
      // Usamos uma regex mais específica para evitar substituir a palavra "autor" ou "automático" acidentalmente
      // mas no contexto de "Nº AUTO", é seguro.
      body_html = body_html.replace(/Nº AUTO/g, `Nº ${contract_number}`)
    }

    // 2. Criar o Contrato
    // Contrato simples: em vez das cláusulas da proposta, usa um modelo resumido e
    // genérico (qualquer máquina/veículo), gravado em body_html para ser editável.
    const isSimple = type === 'SIMPLE'

    if (isSimple) {
      const details = proposal as any
      let companySettings = details.companySettings

      if (!companySettings) {
        companySettings = await this.companySettingsRepository.findFirst()
      }

      body_html = buildSimpleContractHtml({
        contract_number,
        start_date,
        locador: companySettings,
        locatario: details.client,
        items: details.items,
        payment_conditions: proposal.payment_conditions,
        rental_period: proposal.rental_period,
        observations: proposal.observations,
      })
    }

    // Contrato + vínculo da proposta em uma única transação (evita contrato órfão/duplicado)
    const contract = await prisma.$transaction(async (tx) => {
      const locked = await tx.commercialProposal.findUnique({
        where: { id: proposalId },
        select: { contractId: true },
      })
      if (locked?.contractId) {
        throw new AppError('Esta proposta já possui um contrato vinculado.', 400)
      }

      const created = await tx.contract.create({
        data: {
          contract_number,
          clientId: proposal.clientId,
          description: proposal.technical_notes || `Contrato vindo da Proposta ${proposal.proposal_number}`,
          start_date,
          end_date: endDate,
          status: 'ACTIVE',
          type,
          total_value: totalValue,
          responsible_name: proposal.contact_name,
          responsible_phone: proposal.contact_phone,
          responsible_email: proposal.contact_email,
          body_html,
          observations: proposal.observations ? proposal.observations.replace(/\[CONTRACT_NUMBER\]/g, contract_number).replace(/\[NÚMERO DO CONTRATO\]/g, contract_number).replace(/Nº AUTO/g, `Nº ${contract_number}`) : null,
          // Comissão herdada da proposta: vendedor = criador da proposta
          sellerId: proposal.userId ?? undefined,
          commission_percentage: proposal.commission_percentage ?? undefined,
          commission_start_date: proposal.commission_percentage ? start_date : undefined,
        },
      })

      await tx.commercialProposal.update({
        where: { id: proposalId },
        data: { status: 'CONVERTED', contractId: created.id },
      })

      // Cada item com equipamento vinculado vira uma movimentação do contrato
      const movementsByAsset = new Map<
        string,
        {
          rentalValue: number
          franchiseHours: number | null
          extraHourValue: number | null
          notes: string[]
        }
      >()

      for (const item of items) {
        if (!item.assetId) continue
        const quantity = Number(item.quantity || 0)
        const monthlyValue = Number(item.monthly_value || 0)
        if (quantity <= 0) continue

        const current = movementsByAsset.get(item.assetId) ?? {
          rentalValue: 0,
          franchiseHours: null,
          extraHourValue: null,
          notes: [],
        }
        current.rentalValue += quantity * monthlyValue
        if (item.franchise_hours != null) {
          current.franchiseHours = Number(item.franchise_hours)
        }
        if (item.extra_hour_value != null) {
          current.extraHourValue = Number(item.extra_hour_value)
        }
        const note = item.notes || item.description
        if (note) current.notes.push(note)
        movementsByAsset.set(item.assetId, current)
      }

      for (const [assetId, movement] of movementsByAsset) {
        await tx.assetMovement.create({
          data: {
            contractId: created.id,
            assetId,
            mobilization_date: start_date,
            rental_value: movement.rentalValue,
            franchise_hours: movement.franchiseHours ?? undefined,
            extra_hour_value: movement.extraHourValue ?? undefined,
            billing_cycle: 'MONTHLY',
            calculation_rule: 'COMMERCIAL_30_DAYS',
            notes: movement.notes.length > 0 ? movement.notes.join(' | ') : undefined,
          },
        })
      }

      return created
    })

    return { contract }
  }
}
