import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateMeasurementBulletin } from '../../../services/factories/make-update-measurement-bulletin'

export async function updateMeasurementBulletin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const bodySchema = z.object({
    status: z.enum(['DRAFT', 'APPROVED', 'INVOICED']).optional(),
    notes: z.string().optional().nullable(),
  })

  const { id } = paramsSchema.parse(request.params)
  const body = bodySchema.parse(request.body)
  const useCase = makeUpdateMeasurementBulletin()
  const { measurementBulletin } = await useCase.execute({ id, ...body })

  return reply.status(200).send({ measurementBulletin })
}
