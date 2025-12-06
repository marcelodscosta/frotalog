import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateMaintenance } from '../../../services/factories/make-update-maintenance'

export async function updateMaintenance(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const bodySchema = z.object({
    actual_cost: z.number().positive().optional(),
    completed_date: z.coerce.date().optional(),
    document_link: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  })

  const { id } = paramsSchema.parse(request.params)
  const data = bodySchema.parse(request.body)

  const updateMaintenance = makeUpdateMaintenance()
  const { maintenance } = await updateMaintenance.execute({ id, data })

  return reply.status(200).send({ maintenance })
}

