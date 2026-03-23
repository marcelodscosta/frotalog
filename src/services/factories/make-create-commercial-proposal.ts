import { PrismaCommercialProposalRepository } from '../../repositories/prisma/prisma-commercial-proposal-repository'
import { CreateCommercialProposalUseCase } from '../commercial-proposal/create-commercial-proposal-use-case'

export function makeCreateCommercialProposal() {
  const proposalRepository = new PrismaCommercialProposalRepository()
  const useCase = new CreateCommercialProposalUseCase(proposalRepository)

  return useCase
}
