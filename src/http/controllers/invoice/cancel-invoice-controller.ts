import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeDeleteInvoice } from '../../../services/factories/make-delete-invoice'

export async function cancelInvoice(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })
  const bodySchema = z.object({
    reason: z.string().trim().max(500).optional(),
  })

  const { id } = paramsSchema.parse(request.params)
  const { reason } = bodySchema.parse(request.body ?? {})

  const useCase = makeDeleteInvoice()
  await useCase.execute(id, reason)

  return reply.status(204).send()
}
