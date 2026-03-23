import { PrismaCommercialProposalRepository } from '../../repositories/prisma/prisma-commercial-proposal-repository'
import { SearchCommercialProposalsUseCase } from '../commercial-proposal/search-commercial-proposals-use-case'

export function makeSearchCommercialProposals() {
  const proposalsRepository = new PrismaCommercialProposalRepository()
  const useCase = new SearchCommercialProposalsUseCase(proposalsRepository)

  return useCase
}
