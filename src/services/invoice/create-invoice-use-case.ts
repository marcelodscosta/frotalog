import { Invoice, Prisma } from '../../generated/prisma'
import { IInvoiceRepository } from '../../repositories/interfaces/IInvoiceRepository'
import { IMeasurementBulletinRepository } from '../../repositories/interfaces/IMeasurementBulletinRepository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { AppError } from '../errors/app-error'
import { prisma } from '../../lib/prisma'

interface CreateInvoiceRequest {
  measurementBulletinIds: string[]
  invoice_number?: string
  issue_date: Date
  due_date: Date
  total_value?: number
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
    const bulletins = await Promise.all(
      data.measurementBulletinIds.map((id) =>
        this.measurementBulletinRepository.findById(id),
      ),
    )

    if (bulletins.some((b) => !b)) {
      throw new ResourceNotFoundError()
    }

    // Check if any bulletin already has an active invoice
    for (const id of data.measurementBulletinIds) {
      const existing = await this.invoiceRepository.findByMeasurementBulletinId(id)
      if (existing && existing.is_active) {
        throw new AppError(
          `O boletim de medição ${id} já possui uma fatura ativa.`,
          409,
        )
      }
    }

    // Auto-generate invoice number if not provided
    const invoiceNumber =
      data.invoice_number || (await this.generateNextInvoiceNumber())

    // Sum total value of all bulletins for calculation if not provided
    const totalBulletinsValue = bulletins.reduce(
      (acc, b) => acc + (b ? Number(b.total_value) : 0),
      0,
    )

    const invoiceValue = data.total_value ?? totalBulletinsValue

    const result = await prisma.$transaction(async (tx) => {
      // Create new invoice
      const invoice = await tx.invoice.create({
        data: {
          invoice_number: invoiceNumber,
          issue_date: data.issue_date,
          due_date: data.due_date,
          total_value: invoiceValue,
          notes: data.notes,
          measurementBulletins: {
            connect: data.measurementBulletinIds.map((id) => ({ id })),
          },
        },
      })

      // Update all bulletins status to INVOICED
      await tx.measurementBulletin.updateMany({
        where: { id: { in: data.measurementBulletinIds } },
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
