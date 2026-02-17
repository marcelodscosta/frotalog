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
  })

  const { page, status, contractId, assetId } = querySchema.parse(request.query)
  const useCase = makeFetchInvoices()
  const { invoices } = await useCase.execute({ status, page, contractId, assetId })

  return reply.status(200).send(invoices)
}
