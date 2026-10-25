import { Commission } from '../../generated/prisma'
import { ICommissionRepository } from '../../repositories/interfaces/ICommissionRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface UpdateCommissionRequest {
  id: string
  base_value?: number
  notes?: string | null
}

interface UpdateCommissionResponse {
  commission: Commission
}

/**
 * Informa/ajusta o valor base do mês. A comissão é recalculada com o
 * percentual já definido no contrato.
 */
export class UpdateCommissionUseCase {
  constructor(private commissionRepository: ICommissionRepository) {}

  async execute({ id, base_value, notes }: UpdateCommissionRequest): Promise<UpdateCommissionResponse> {
    const existing = await this.commissionRepository.findById(id)
    if (!existing) throw new ResourceNotFoundError()

    const percentage = Number(existing.commission_percentage)
    const commissionValue = base_value != null
      ? base_value * (percentage / 100)
      : Number(existing.commission_value)

    const commission = await this.commissionRepository.update(id, {
      base_value,
      commission_value: commissionValue,
      notes,
    })

    return { commission }
  }
}
