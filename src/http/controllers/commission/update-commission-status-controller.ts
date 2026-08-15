import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateCommissionStatus } from '../../../services/factories/make-update-commission-status'

export async function updateCommissionStatus(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const bodySchema = z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'PAID']),
    paid_at: z.string().optional(),
  })

  const { id } = paramsSchema.parse(request.params)
  const { status, paid_at } = bodySchema.parse(request.body)

  const useCase = makeUpdateCommissionStatus()
  const { commission } = await useCase.execute({ id, status, paid_at })

  return reply.status(200).send({ commission })
}
