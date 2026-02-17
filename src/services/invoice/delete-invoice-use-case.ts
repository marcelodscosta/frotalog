import { Invoice } from '../../generated/prisma'
import { IInvoiceRepository } from '../../repositories/interfaces/IInvoiceRepository'
import { IMeasurementBulletinRepository } from '../../repositories/interfaces/IMeasurementBulletinRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

export class DeleteInvoiceUseCase {
  constructor(
    private invoiceRepository: IInvoiceRepository,
    private measurementBulletinRepository: IMeasurementBulletinRepository,
  ) {}

  async execute(id: string): Promise<Invoice> {
    const existing = await this.invoiceRepository.findById(id)
    if (!existing) throw new ResourceNotFoundError()

    // Revert bulletin status to APPROVED when invoice is deleted
    if (existing.measurementBulletinId) {
      await this.measurementBulletinRepository.update(
        existing.measurementBulletinId,
        { status: 'APPROVED' },
      )
    }

    return this.invoiceRepository.delete(id)
  }
}
