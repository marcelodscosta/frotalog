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

    // Revert all associated bulletins status to APPROVED when invoice is deleted
    const invoiceWithBulletins = await this.invoiceRepository.findByIdWithDetails(id)
    
    if (invoiceWithBulletins && 'measurementBulletins' in invoiceWithBulletins) {
      const bulletins = (invoiceWithBulletins as any).measurementBulletins
      if (Array.isArray(bulletins)) {
        await Promise.all(
          bulletins.map((b: any) =>
            this.measurementBulletinRepository.update(b.id, {
              status: 'APPROVED',
              invoice: { disconnect: true },
            }),
          ),
        )
      }
    }

    return this.invoiceRepository.delete(id)
  }
}
