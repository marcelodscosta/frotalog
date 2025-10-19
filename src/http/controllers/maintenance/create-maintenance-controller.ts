import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateMaintenance } from '../../../services/factories/make-create-maintenance'

export async function createMaintenance(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createBodySchema = z.object({
    assetId: z.string().uuid(),
    supplierId: z.string().uuid(),
    type: z.enum(['PREVENTIVE', 'CORRECTIVE', 'EMERGENCY']),
    description: z.string().min(10),
    scheduled_date: z.coerce.date(),
    estimated_cost: z.number().positive().optional(),
    notes: z.string().optional(),
  })

  const { assetId, supplierId, type, description, scheduled_date, estimated_cost, notes } =
    createBodySchema.parse(request.body)

  const createMaintenance = makeCreateMaintenance()
  const { maintenance } = await createMaintenance.execute({
    assetId,
    supplierId,
    type,
    description,
    scheduled_date,
    estimated_cost,
    notes,
  })

  return reply.status(201).send({ maintenance })
}
