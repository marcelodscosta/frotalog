import { PrismaCommercialProposalRepository } from '../../repositories/prisma/prisma-commercial-proposal-repository'
import { GetCommercialProposalUseCase } from '../commercial-proposal/get-commercial-proposal-use-case'

export function makeGetCommercialProposal() {
  const proposalRepository = new PrismaCommercialProposalRepository()
  const useCase = new GetCommercialProposalUseCase(proposalRepository)

  return useCase
}
