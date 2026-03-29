import { PrismaCommercialProposalRepository } from '../../repositories/prisma/prisma-commercial-proposal-repository'
import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { DeleteCommercialProposalUseCase } from '../commercial-proposal/delete-commercial-proposal-use-case'

export function makeDeleteCommercialProposal() {
  const proposalRepository = new PrismaCommercialProposalRepository()
  const contractRepository = new PrismaContractRepository()
  const useCase = new DeleteCommercialProposalUseCase(proposalRepository, contractRepository)

  return useCase
}
