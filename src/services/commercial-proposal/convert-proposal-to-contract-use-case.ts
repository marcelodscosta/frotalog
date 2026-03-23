import { Contract } from '../../generated/prisma'
import { ICommercialProposalRepository } from '../../repositories/interfaces/ICommercialProposalRepository'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface ConvertProposalToContractRequest {
  proposalId: string
  contract_number: string
  start_date: Date
}

export class ConvertProposalToContractUseCase {
  constructor(
    private proposalRepository: ICommercialProposalRepository,
    private contractRepository: IContractRepository
  ) {}

  async execute({ proposalId, contract_number, start_date }: ConvertProposalToContractRequest): Promise<{ contract: Contract }> {
    const proposal = await this.proposalRepository.getProposalWithDetails(proposalId)

    if (!proposal) {
      throw new ResourceNotFoundError()
    }

    if (proposal.status === 'CONVERTED') {
       throw new Error('Esta proposta já foi convertida em contrato.')
    }

    // 1. Criar o Contrato
    const contract = await this.contractRepository.create({
      contract_number,
      clientId: proposal.clientId,
      description: proposal.technical_notes || `Contrato vindo da Proposta ${proposal.proposal_number}`,
      start_date,
      status: 'ACTIVE',
      responsible_name: proposal.contact_name,
      responsible_phone: proposal.contact_phone,
      responsible_email: proposal.contact_email,
    })

    // 2. Atualizar status da proposta e vincular ao contrato
    await this.proposalRepository.updateProposal(proposalId, {
       status: 'CONVERTED',
       contract: {
          connect: { id: contract.id }
       }
    })

    return { contract }
  }
}
