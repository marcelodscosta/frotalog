import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { PrismaSupplierRepository } from '../../repositories/prisma/prisma-supplier-repository'
import { PrismaCommercialProposalRepository } from '../../repositories/prisma/prisma-commercial-proposal-repository'
import { PrismaCompanySettingsRepository } from '../../repositories/prisma/prisma-company-settings-repository'
import { CreateContractUseCase } from '../contract/create-contract-use-case'

export function makeCreateContract() {
  const contractRepository = new PrismaContractRepository()
  const supplierRepository = new PrismaSupplierRepository()
  const commercialProposalRepository = new PrismaCommercialProposalRepository()
  const companySettingsRepository = new PrismaCompanySettingsRepository()
  
  const createContractUseCase = new CreateContractUseCase(
    contractRepository,
    supplierRepository,
    commercialProposalRepository,
    companySettingsRepository,
  )
  
  return createContractUseCase
}
