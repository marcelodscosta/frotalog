import { PrismaCommissionRepository } from '../../repositories/prisma/prisma-commission-repository'
import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { ListContractCommissionsUseCase } from '../commission/list-contract-commissions-use-case'

export function makeListContractCommissions() {
  return new ListContractCommissionsUseCase(
    new PrismaCommissionRepository(),
    new PrismaContractRepository(),
  )
}
