import { PrismaCommercialProposalRepository } from '../../repositories/prisma/prisma-commercial-proposal-repository'
import { DeleteCommercialProposalUseCase } from '../commercial-proposal/delete-commercial-proposal-use-case'

export function makeDeleteCommercialProposal() {
  const proposalRepository = new PrismaCommercialProposalRepository()
  const useCase = new DeleteCommercialProposalUseCase(proposalRepository)

  return useCase
}
