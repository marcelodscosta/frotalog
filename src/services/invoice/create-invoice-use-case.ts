import { Invoice, Prisma } from '../../generated/prisma'
import { IInvoiceRepository } from '../../repositories/interfaces/IInvoiceRepository'
import { IMeasurementBulletinRepository } from '../../repositories/interfaces/IMeasurementBulletinRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { AppError } from '../errors/app-error'
import { prisma } from '../../lib/prisma'

interface CreateInvoiceRequest {
  measurementBulletinId: string
  invoice_number?: string
  issue_date: Date
  due_date: Date
  notes?: string | null
}

interface CreateInvoiceResponse {
  invoice: Invoice
}

export class CreateInvoiceUseCase {
  constructor(
    private invoiceRepository: IInvoiceRepository,
    private measurementBulletinRepository: IMeasurementBulletinRepository,
  ) {}

  async execute(data: CreateInvoiceRequest): Promise<CreateInvoiceResponse> {
    const bulletin = await this.measurementBulletinRepository.findById(
      data.measurementBulletinId,
    )
    if (!bulletin) throw new ResourceNotFoundError()

    // Check if an invoice already exists for this bulletin
    const existing = await this.invoiceRepository.findByMeasurementBulletinId(
      data.measurementBulletinId,
    )
    if (existing && existing.is_active) {
      throw new AppError(
        'Já existe uma fatura para este boletim de medição.',
        409,
      )
    }

    // Auto-generate invoice number if not provided
    const invoiceNumber =
      data.invoice_number || (await this.generateNextInvoiceNumber())

    const result = await prisma.$transaction(async (tx) => {
      let invoice: Invoice

      if (existing && !existing.is_active) {
        // Reactivate and update existing invoice
        invoice = await tx.invoice.update({
          where: { id: existing.id },
          data: {
            is_active: true,
            status: 'PENDING', // Reset status
            invoice_number: invoiceNumber,
            issue_date: data.issue_date,
            due_date: data.due_date,
            total_value: bulletin.total_value, // Update value in case bulletin changed
            notes: data.notes,
            payment_date: null,
            is_paid: false,
          },
        })
      } else {
        // Create new invoice
        invoice = await tx.invoice.create({
          data: {
            measurementBulletinId: data.measurementBulletinId,
            invoice_number: invoiceNumber,
            issue_date: data.issue_date,
            due_date: data.due_date,
            total_value: bulletin.total_value,
            notes: data.notes,
          },
        })
      }

      // Update bulletin status to INVOICED
      await tx.measurementBulletin.update({
        where: { id: data.measurementBulletinId },
        data: { status: 'INVOICED' },
      })

      return { invoice }
    })

    return result
  }

  private async generateNextInvoiceNumber(): Promise<string> {
    // Get the company settings for the starting number
    const settings = await prisma.companySettings.findFirst()
    const startNumber = settings?.invoice_start_number ?? 1

    // Find the last invoice (highest number) including inactive ones to avoid collision
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { created_at: 'desc' },
    })

    let nextNumber = startNumber

    if (lastInvoice?.invoice_number) {
      // Try to extract number from format FAT-NNNNNN
      const match = lastInvoice.invoice_number.match(/FAT-(\d+)/)
      if (match) {
        nextNumber = Math.max(startNumber, parseInt(match[1], 10) + 1)
      } else {
        // If no match, count total invoices + start number
        const count = await prisma.invoice.count({
          where: { is_active: true },
        })
        nextNumber = Math.max(startNumber, count + 1)
      }
    }

    return `FAT-${String(nextNumber).padStart(6, '0')}`
  }
}
