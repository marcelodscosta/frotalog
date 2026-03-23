import { Contract } from '../../generated/prisma'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { ISupplierRepository } from '../../repositories/interfaces/ISupplierRepository'
import { ICommercialProposalRepository } from '../../repositories/interfaces/ICommercialProposalRepository'
import { ClientNotFoundError } from '../errors/client-not-found-error'
import { ContractAlreadyExistsError } from '../errors/contract-already-exist-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

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
  body_html?: string | null
  signed_contract_url?: string | null
  proposalId?: string | null
}

interface CreateContractResponse {
  contract: Contract
}

export class CreateContractUseCase {
  constructor(
    private contractRepository: IContractRepository,
    private supplierRepository: ISupplierRepository,
    private commercialProposalRepository: ICommercialProposalRepository,
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
      const sequence = (count + 1).toString().padStart(3, '0')
      contract_number = `${currentYear}.${sequence}`
    }

    const contractWithSameNumber =
      await this.contractRepository.findByContractNumber(contract_number)

    if (contractWithSameNumber) {
      // Se geramos um número que já existe, tentamos o próximo
      if (data.contract_number === 'AUTO') {
          const currentYear = new Date().getFullYear()
          const count = await this.contractRepository.countByYear(currentYear)
          const sequence = (count + 2).toString().padStart(3, '0') // Try next
          contract_number = `${currentYear}.${sequence}`
      } else {
        throw new ContractAlreadyExistsError()
      }
    }

    // Se houver uma proposta, vincula e atualiza o status
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
      body_html: data.body_html,
      signed_contract_url: data.signed_contract_url,
    })

    if (data.proposalId) {
      const proposal = await this.commercialProposalRepository.findById(data.proposalId)
      if (!proposal) {
        throw new ResourceNotFoundError()
      }

      await this.commercialProposalRepository.updateProposal(data.proposalId, {
        contract: { connect: { id: contract.id } },
        status: 'CONVERTED' as any,
      })
    }

    return { contract }
  }
}
