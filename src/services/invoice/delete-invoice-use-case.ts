import { Invoice } from '../../generated/prisma'
import { IInvoiceRepository } from '../../repositories/interfaces/IInvoiceRepository'
import { IMeasurementBulletinRepository } from '../../repositories/interfaces/IMeasurementBulletinRepository'
import { IBankAccountRepository } from '../../repositories/interfaces/IBankAccountRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { prisma } from '../../lib/prisma'

export class DeleteInvoiceUseCase {
  constructor(
    private invoiceRepository: IInvoiceRepository,
    private measurementBulletinRepository: IMeasurementBulletinRepository,
    private bankAccountRepository: IBankAccountRepository,
  ) {}

  async execute(id: string): Promise<Invoice> {
    const existing = await this.invoiceRepository.findById(id)
    if (!existing) throw new ResourceNotFoundError()

    // Fetch details including measurement bulletins and financial transactions
    const invoiceWithDetails = await this.invoiceRepository.findByIdWithDetails(id)
    if (!invoiceWithDetails) throw new ResourceNotFoundError()

    return await prisma.$transaction(async (tx) => {
      // 1. Handle associated financial transactions (Invoices only have INCOME transactions)
      if ('transactions' in invoiceWithDetails && Array.isArray(invoiceWithDetails.transactions)) {
        for (const transaction of invoiceWithDetails.transactions) {
          // Revert bank account balance
          await tx.bankAccount.update({
            where: { id: transaction.bankAccountId },
            data: { balance: { decrement: transaction.amount } },
          })

          // Delete the transaction record
          await tx.financialTransaction.delete({
            where: { id: transaction.id },
          })
        }
      }

      // 2. Revert all associated bulletins status to APPROVED when invoice is deleted
      if ('measurementBulletins' in invoiceWithDetails && Array.isArray(invoiceWithDetails.measurementBulletins)) {
        const bulletins = invoiceWithDetails.measurementBulletins
        await Promise.all(
          bulletins.map((b: any) =>
            tx.measurementBulletin.update({
              where: { id: b.id },
              data: {
                status: 'APPROVED',
                invoiceId: null,
              },
            }),
          ),
        )
      }

      // 3. Perform soft delete on the invoice
      return await tx.invoice.update({
        where: { id },
        data: { is_active: false },
      })
    })
  }
}
