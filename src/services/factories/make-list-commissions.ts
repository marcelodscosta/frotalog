import { PrismaCommissionRepository } from '../../repositories/prisma/prisma-commission-repository'
import { ListCommissionsUseCase } from '../commission/list-commissions-use-case'

export function makeListCommissions() {
  return new ListCommissionsUseCase(new PrismaCommissionRepository())
}
