import { CommercialProposal } from '../../generated/prisma'
import { ICommercialProposalRepository } from '../../repositories/interfaces/ICommercialProposalRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetCommercialProposalRequest {
  id: string
}

export class GetCommercialProposalUseCase {
  constructor(private proposalRepository: ICommercialProposalRepository) {}

  async execute({ id }: GetCommercialProposalRequest): Promise<{ proposal: CommercialProposal }> {
    const proposal = await this.proposalRepository.getProposalWithDetails(id)
    if (!proposal) {
      throw new ResourceNotFoundError()
    }

    return { proposal }
  }
}
