import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeListCommissions } from '../../../services/factories/make-list-commissions'

export async function listCommissions(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    sellerId: z.string().uuid().optional(),
    contractId: z.string().uuid().optional(),
    status: z.enum(['PENDING', 'CONFIRMED', 'PAID']).optional(),
    year: z.coerce.number().int().optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
  })

  const filters = querySchema.parse(request.query)
  const useCase = makeListCommissions()
  const result = await useCase.execute(filters)

  return reply.status(200).send(result)
}
