import { PrismaCommercialProposalRepository } from '../../repositories/prisma/prisma-commercial-proposal-repository'
import { PrismaCompanySettingsRepository } from '../../repositories/prisma/prisma-company-settings-repository'
import { CreateCommercialProposalUseCase } from '../commercial-proposal/create-commercial-proposal-use-case'

export function makeCreateCommercialProposal() {
  const proposalRepository = new PrismaCommercialProposalRepository()
  const companySettingsRepository = new PrismaCompanySettingsRepository()
  const useCase = new CreateCommercialProposalUseCase(proposalRepository, companySettingsRepository)

  return useCase
}
