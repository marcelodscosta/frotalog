import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFetchInvoices } from '../../../services/factories/make-fetch-invoices'

export async function fetchInvoices(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    page: z.coerce.number().default(1),
    status: z.enum(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED']).optional(),
    contractId: z.string().optional(),
    assetId: z.string().optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
    year: z.coerce.number().int().min(2020).optional(),
    search: z.string().optional(),
  })

  const { page, status, contractId, assetId, month, year, search } = querySchema.parse(request.query)
  const useCase = makeFetchInvoices()
  const { invoices } = await useCase.execute({ status, page, contractId, assetId, month, year, search })

  return reply.status(200).send(invoices)
}

export async function getInvoiceSummaryController(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    month: z.coerce.number().int().min(1).max(12),
    year: z.coerce.number().int().min(2020),
  })
  const { month, year } = querySchema.parse(request.query)

  const { PrismaInvoiceRepository } = await import('../../../repositories/prisma/prisma-invoice-repository')
  const repo = new PrismaInvoiceRepository()
  const summary = await repo.getSummary(month, year)
  return reply.send({ summary })
}
