import { MeasurementBulletin } from '../../generated/prisma'
import { IMeasurementBulletinRepository } from '../../repositories/interfaces/IMeasurementBulletinRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { AppError } from '../errors/app-error'
import { recalculateContractMonthCommission } from '../commission/recalculate-contract-month-commission'

export class DeleteMeasurementBulletinUseCase {
  constructor(
    private measurementBulletinRepository: IMeasurementBulletinRepository,
  ) {}

  async execute(id: string): Promise<MeasurementBulletin> {
    const existing = await this.measurementBulletinRepository.findById(id)
    if (!existing) throw new ResourceNotFoundError()

    if (existing.status === 'INVOICED' || existing.invoiceId) {
      throw new AppError('Boletim faturado não pode ser excluído. Cancele a fatura primeiro.', 400)
    }

    const deleted = await this.measurementBulletinRepository.delete(id)

    // Remove o valor do boletim excluído da comissão mensal do contrato
    await recalculateContractMonthCommission(existing.contractId, existing.reference_start)

    return deleted
  }
}
