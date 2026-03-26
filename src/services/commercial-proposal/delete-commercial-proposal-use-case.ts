import { CommercialProposal } from '../../generated/prisma'
import { ICommercialProposalRepository } from '../../repositories/interfaces/ICommercialProposalRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { ProposalUsedByContractError } from '../errors/proposal-used-by-contract-error'

interface DeleteCommercialProposalRequest {
  id: string
}

export class DeleteCommercialProposalUseCase {
  constructor(private proposalRepository: ICommercialProposalRepository) {}

  async execute({ id }: DeleteCommercialProposalRequest): Promise<{ proposal: CommercialProposal }> {
    const proposal = await this.proposalRepository.findById(id)

    if (!proposal) {
      throw new ResourceNotFoundError()
    }

    if (proposal.contractId) {
      throw new ProposalUsedByContractError()
    }

    const deletedProposal = await this.proposalRepository.deleteProposal(id)

    return { proposal: deletedProposal }
  }
}
