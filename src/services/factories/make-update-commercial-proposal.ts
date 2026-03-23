import { PrismaCommercialProposalRepository } from '../../repositories/prisma/prisma-commercial-proposal-repository'
import { UpdateCommercialProposalUseCase } from '../commercial-proposal/update-commercial-proposal-use-case'

export function makeUpdateCommercialProposal() {
  const proposalRepository = new PrismaCommercialProposalRepository()
  const useCase = new UpdateCommercialProposalUseCase(proposalRepository)

  return useCase
}
