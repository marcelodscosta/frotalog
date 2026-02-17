import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeDeleteInvoice } from '../../../services/factories/make-delete-invoice'

export async function deleteInvoice(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)
  const useCase = makeDeleteInvoice()
  await useCase.execute(id)

  return reply.status(204).send()
}
