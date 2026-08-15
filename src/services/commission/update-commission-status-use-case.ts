import { Commission, CommissionStatus } from '../../generated/prisma'
import { ICommissionRepository } from '../../repositories/interfaces/ICommissionRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface UpdateCommissionStatusRequest {
  id: string
  status: CommissionStatus
  paid_at?: string // ISO date string, optional
}

export class UpdateCommissionStatusUseCase {
  constructor(private commissionRepository: ICommissionRepository) {}

  async execute({ id, status, paid_at }: UpdateCommissionStatusRequest): Promise<{ commission: Commission }> {
    const existing = await this.commissionRepository.findById(id)
    if (!existing) throw new ResourceNotFoundError()

    const paidDate = paid_at ? new Date(paid_at) : undefined
    const commission = await this.commissionRepository.updateStatus(id, status, paidDate)

    return { commission }
  }
}
