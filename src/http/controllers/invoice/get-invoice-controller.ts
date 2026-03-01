import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetInvoice } from '../../../services/factories/make-get-invoice'

export async function getInvoice(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)
  const useCase = makeGetInvoice()
  const { invoice } = await useCase.execute(id)

  return reply.status(200).send({ invoice })
}
