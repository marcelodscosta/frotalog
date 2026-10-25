import { PrismaCommissionRepository } from '../../repositories/prisma/prisma-commission-repository'
import { UpdateCommissionUseCase } from '../commission/update-commission-use-case'

export function makeUpdateCommission() {
  return new UpdateCommissionUseCase(new PrismaCommissionRepository())
}
