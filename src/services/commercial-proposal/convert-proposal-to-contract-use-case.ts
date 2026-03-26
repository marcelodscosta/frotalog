import { Contract } from '../../generated/prisma'
import { ICommercialProposalRepository } from '../../repositories/interfaces/ICommercialProposalRepository'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { ProposalNotApprovedError } from '../errors/proposal-not-approved-error'

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

    if (proposal.status !== 'APPROVED') {
       throw new ProposalNotApprovedError()
    }

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
    const contract = await this.contractRepository.create({
      contract_number,
      clientId: proposal.clientId,
      description: proposal.technical_notes || `Contrato vindo da Proposta ${proposal.proposal_number}`,
      start_date,
      status: 'ACTIVE',
      responsible_name: proposal.contact_name,
      responsible_phone: proposal.contact_phone,
      responsible_email: proposal.contact_email,
      body_html,
      observations: proposal.observations ? proposal.observations.replace(/\[CONTRACT_NUMBER\]/g, contract_number).replace(/\[NÚMERO DO CONTRATO\]/g, contract_number).replace(/Nº AUTO/g, `Nº ${contract_number}`) : null,
    })

    // 3. Atualizar status da proposta e vincular ao contrato
    await this.proposalRepository.updateProposal(proposalId, {
       status: 'CONVERTED',
       contract: {
          connect: { id: contract.id }
       }
    })

    return { contract }
  }
}
