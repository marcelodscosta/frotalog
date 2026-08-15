import { PrismaCommissionRepository } from '../../repositories/prisma/prisma-commission-repository'
import { UpdateCommissionStatusUseCase } from '../commission/update-commission-status-use-case'

export function makeUpdateCommissionStatus() {
  return new UpdateCommissionStatusUseCase(new PrismaCommissionRepository())
}
