import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateCommission } from '../../../services/factories/make-update-commission'

export async function updateCommission(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const bodySchema = z.object({
    base_value: z.number().nonnegative().optional(),
    notes: z.string().nullable().optional(),
  })

  const { id } = paramsSchema.parse(request.params)
  const { base_value, notes } = bodySchema.parse(request.body)

  const useCase = makeUpdateCommission()
  const { commission } = await useCase.execute({ id, base_value, notes })

  return reply.status(200).send({ commission })
}
