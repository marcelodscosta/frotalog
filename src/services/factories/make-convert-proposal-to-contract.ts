import { PrismaCommercialProposalRepository } from '../../repositories/prisma/prisma-commercial-proposal-repository'
import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { PrismaCompanySettingsRepository } from '../../repositories/prisma/prisma-company-settings-repository'
import { ConvertProposalToContractUseCase } from '../commercial-proposal/convert-proposal-to-contract-use-case'

export function makeConvertProposalToContract() {
  const proposalRepository = new PrismaCommercialProposalRepository()
  const contractRepository = new PrismaContractRepository()
  const companySettingsRepository = new PrismaCompanySettingsRepository()
  const useCase = new ConvertProposalToContractUseCase(proposalRepository, contractRepository, companySettingsRepository)

  return useCase
}
