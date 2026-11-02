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

    const validBulletins = bulletins as NonNullable<(typeof bulletins)[number]>[]

    if (new Set(data.measurementBulletinIds).size !== data.measurementBulletinIds.length) {
      throw new AppError('Há boletins duplicados na seleção.', 400)
    }

    const notApproved = validBulletins.find((b) => !b.is_active || b.status !== 'APPROVED')
    if (notApproved) {
      throw new AppError(
        'Somente boletins aprovados (e não faturados) podem ser faturados.',
        400,
      )
    }

    const contractIds = new Set(validBulletins.map((b) => b.contractId))
    if (contractIds.size > 1) {
      throw new AppError('Todos os boletins da fatura devem pertencer ao mesmo contrato.', 400)
    }
    const contractId = validBulletins[0]?.contractId ?? null

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

    // Sum total value of all bulletins
    const totalBulletinsValue = Math.round(
      validBulletins.reduce((acc, b) => acc + Number(b.total_value), 0) * 100,
    ) / 100

    // Fatura de medição: valor deve ser exatamente o medido (ajustes via despesas/descontos no boletim).
    // Fatura avulsa (sem boletins): valor informado manualmente.
    let invoiceValue: number
    if (validBulletins.length > 0) {
      if (data.total_value !== undefined && Math.abs(data.total_value - totalBulletinsValue) > 0.01) {
        throw new AppError(
          'O valor da fatura difere da soma dos boletins. Lance acréscimos/descontos como despesas do boletim.',
          400,
        )
      }
      invoiceValue = totalBulletinsValue
    } else {
      if (data.total_value === undefined || data.total_value <= 0) {
        throw new AppError('Informe o valor da fatura avulsa.', 400)
      }
      invoiceValue = data.total_value
    }

    const result = await prisma.$transaction(async (tx) => {
      // Auto-generate invoice number ONLY if it is a real invoice (has bulletins) and not provided
      let invoiceNumber = data.invoice_number
      if (!invoiceNumber && data.measurementBulletinIds.length > 0) {
        invoiceNumber = await this.generateNextInvoiceNumber(tx)
      }

      // Create new invoice
      const invoice = await tx.invoice.create({
        data: {
          invoice_number: invoiceNumber,
          issue_date: data.issue_date,
          due_date: data.due_date,
          total_value: invoiceValue,
          notes: data.notes,
          contractId,
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

  private async generateNextInvoiceNumber(
    tx: Prisma.TransactionClient,
  ): Promise<string> {
    // Serializa a geração entre transações concorrentes
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(78123001)`

    const settings = await tx.companySettings.findFirst()
    const startNumber = settings?.invoice_start_number ?? 1

    // Considera faturas ativas e canceladas para nunca reutilizar um número
    const rows = await tx.invoice.findMany({
      where: { invoice_number: { not: null } },
      select: { invoice_number: true },
    })

    const usedNumbers = new Set<number>()
    for (const row of rows) {
      const match = row.invoice_number?.match(/FAT-(\d+)/)
      if (match) usedNumbers.add(Number(match[1]))
    }

    let nextNumber = Math.max(
      startNumber,
      usedNumbers.size > 0 ? Math.max(...usedNumbers) + 1 : startNumber,
    )

    // Proteção adicional contra duplicidade em bases legadas
    while (usedNumbers.has(nextNumber)) nextNumber += 1

    return `FAT-${String(nextNumber).padStart(6, '0')}`
  }
}
