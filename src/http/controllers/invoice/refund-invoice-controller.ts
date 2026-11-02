import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { RefundInvoiceUseCase } from '../../../services/invoice/refund-invoice-use-case'
import { PrismaInvoiceRepository } from '../../../repositories/prisma/prisma-invoice-repository'

export async function refundInvoiceController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)

  const refundInvoiceUseCase = new RefundInvoiceUseCase(
    new PrismaInvoiceRepository(),
  )
  const { invoice } = await refundInvoiceUseCase.execute(id)

  return reply.status(200).send({ invoice })
}
