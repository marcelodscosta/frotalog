import { Contract, ContractStatus, ContractType } from '../../generated/prisma'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { ISupplierRepository } from '../../repositories/interfaces/ISupplierRepository'
import { ICommercialProposalRepository } from '../../repositories/interfaces/ICommercialProposalRepository'
import { ICompanySettingsRepository } from '../../repositories/interfaces/ICompanySettingsRepository'
import { AppError } from '../errors/app-error'
import { ClientNotFoundError } from '../errors/client-not-found-error'
import { ContractAlreadyExistsError } from '../errors/contract-already-exist-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { ProposalNotApprovedError } from '../errors/proposal-not-approved-error'
import { buildSimpleContractHtml } from '../commercial-proposal/simple-contract-template'

interface CreateContractRequest {
  contract_number: string
  description?: string | null
  clientId: string
  responsible_name?: string | null
  responsible_phone?: string | null
  responsible_email?: string | null
  start_date: Date
  end_date?: Date | null
  total_value?: number | null
  billing_day?: number | null
  notes?: string | null
  observations?: string | null
  body_html?: string | null
  signed_contract_url?: string | null
  proposalId?: string | null
  status?: ContractStatus
  type?: ContractType
  sellerId?: string | null
  commission_percentage?: number | null
  commission_start_date?: Date | null
  commission_end_date?: Date | null
}

interface CreateContractResponse {
  contract: Contract
}

export class CreateContractUseCase {
  constructor(
    private contractRepository: IContractRepository,
    private supplierRepository: ISupplierRepository,
    private commercialProposalRepository: ICommercialProposalRepository,
    private companySettingsRepository: ICompanySettingsRepository,
  ) {}

  async execute(data: CreateContractRequest): Promise<CreateContractResponse> {
    const client = await this.supplierRepository.findById(data.clientId)

    if (!client || !client.isClient) {
      throw new ClientNotFoundError()
    }

    let contract_number = data.contract_number

    if (!contract_number || contract_number === 'AUTO') {
      const currentYear = new Date().getFullYear()
      const count = await this.contractRepository.countByYear(currentYear)
      
      const settings = await this.companySettingsRepository.findFirst()
      const startNumber = settings?.contract_start_number || 1
      
      const sequence = Math.max(count + 1, startNumber).toString().padStart(3, '0')
      contract_number = `${currentYear}.${sequence}`
    }

    const contractWithSameNumber =
      await this.contractRepository.findByContractNumber(contract_number)

    if (contractWithSameNumber) {
      // Se geramos um número que já existe, tentamos o próximo
      if (data.contract_number === 'AUTO') {
          const currentYear = new Date().getFullYear()
          const count = await this.contractRepository.countByYear(currentYear)
          const settings = await this.companySettingsRepository.findFirst()
          const startNumber = settings?.contract_start_number || 1
          
          const sequence = (Math.max(count + 1, startNumber) + 1).toString().padStart(3, '0') // Try next
          contract_number = `${currentYear}.${sequence}`
      } else {
        throw new ContractAlreadyExistsError()
      }
    }

    // Valida a proposta antes de criar o contrato para não deixar contrato órfão em caso de erro
    let linkedProposal: Awaited<
      ReturnType<ICommercialProposalRepository['getProposalWithDetails']>
    > = null

    if (data.proposalId) {
      linkedProposal = await this.commercialProposalRepository.getProposalWithDetails(
        data.proposalId,
      )

      if (!linkedProposal) {
        throw new ResourceNotFoundError()
      }

      if (linkedProposal.contractId) {
        throw new AppError('Esta proposta já possui um contrato vinculado.', 400)
      }

      // Propostas antigas podem estar marcadas como CONVERTED sem contrato vinculado.
      if (linkedProposal.status !== 'APPROVED' && linkedProposal.status !== 'CONVERTED') {
        throw new ProposalNotApprovedError()
      }
    }

    // Se houver uma proposta, vincula e atualiza o status
    let body_html = data.body_html
    const isSimple = data.type === 'SIMPLE'

    if (isSimple && !body_html) {
      const settings = await this.companySettingsRepository.findFirst()

      body_html = buildSimpleContractHtml({
        contract_number,
        start_date: data.start_date,
        locador: settings as any,
        locatario: client as any,
        items: (linkedProposal as any)?.items as any[] || [],
        payment_conditions: linkedProposal?.payment_conditions || null,
        rental_period: linkedProposal?.rental_period || null,
        observations: data.observations || linkedProposal?.observations || null,
      })
    }

    const contract = await this.contractRepository.create({
      contract_number,
      description: data.description,
      clientId: data.clientId,
      responsible_name: data.responsible_name,
      responsible_phone: data.responsible_phone,
      responsible_email: data.responsible_email,
      start_date: data.start_date,
      end_date: data.end_date,
      total_value: data.total_value,
      billing_day: data.billing_day,
      notes: data.notes,
      observations: data.observations,
      body_html,
      signed_contract_url: data.signed_contract_url,
      status: data.status,
      type: data.type,
      sellerId: data.sellerId,
      commission_percentage: data.commission_percentage,
      commission_start_date: data.commission_start_date,
      commission_end_date: data.commission_end_date,
    })

    // Se houver uma proposta, vincula, atualiza o status e herda vendedor e comissão
    let sellerIdFromProposal = data.sellerId
    let commissionPercentageFromProposal = data.commission_percentage

    if (linkedProposal) {
      if (linkedProposal.userId && !sellerIdFromProposal) {
        sellerIdFromProposal = linkedProposal.userId
      }

      if (
        linkedProposal.commission_percentage != null &&
        commissionPercentageFromProposal == null
      ) {
        commissionPercentageFromProposal = Number(linkedProposal.commission_percentage)
      }

      await this.commercialProposalRepository.updateProposal(data.proposalId!, {
        contract: { connect: { id: contract.id } },
        status: 'CONVERTED' as any,
      })
    }

    // Atualiza o contrato com os dados herdados da proposta
    const inherited: { sellerId?: string; commission_percentage?: number } = {}

    if (sellerIdFromProposal && sellerIdFromProposal !== data.sellerId) {
      inherited.sellerId = sellerIdFromProposal
    }

    if (commissionPercentageFromProposal != null && commissionPercentageFromProposal !== data.commission_percentage) {
      inherited.commission_percentage = commissionPercentageFromProposal
    }

    if (Object.keys(inherited).length > 0) {
      const updatedContract = await this.contractRepository.updateContract(contract.id, inherited)
      Object.assign(contract, updatedContract)
    }

    return { contract }
  }
}
