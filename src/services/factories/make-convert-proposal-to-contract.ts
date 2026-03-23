import { PrismaCommercialProposalRepository } from '../../repositories/prisma/prisma-commercial-proposal-repository'
import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { ConvertProposalToContractUseCase } from '../commercial-proposal/convert-proposal-to-contract-use-case'

export function makeConvertProposalToContract() {
  const proposalRepository = new PrismaCommercialProposalRepository()
  const contractRepository = new PrismaContractRepository()
  const useCase = new ConvertProposalToContractUseCase(proposalRepository, contractRepository)

  return useCase
}
