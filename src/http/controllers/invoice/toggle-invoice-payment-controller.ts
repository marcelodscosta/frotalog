import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeToggleInvoicePayment } from '../../../services/factories/make-toggle-invoice-payment'

export async function toggleInvoicePayment(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)
  const useCase = makeToggleInvoicePayment()
  const { invoice } = await useCase.execute(id)

  return reply.status(200).send({ invoice })
}
