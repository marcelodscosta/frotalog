import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateMaintenance } from '../../../services/factories/make-create-maintenance'

export async function createMaintenance(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createBodySchema = z.object({
    assetId: z.string(),
    supplierId: z.string(),
    serviceCategoryId: z.string().optional(),
    type: z.enum(['PREVENTIVE', 'CORRECTIVE', 'EMERGENCY']),
    description: z.string().min(10),
    scheduled_date: z.coerce.date(),
    estimated_cost: z.number().positive().optional(),
    equipment_inactive: z.boolean().optional(),
    notes: z.string().optional(),
    assignedToId: z.string().optional(),
  })

  const {
    assetId,
    supplierId,
    serviceCategoryId,
    type,
    description,
    scheduled_date,
    estimated_cost,
    equipment_inactive,
    notes,
    assignedToId,
  } = createBodySchema.parse(request.body)

  const createMaintenance = makeCreateMaintenance()
  const { maintenance } = await createMaintenance.execute({
    assetId,
    supplierId,
    serviceCategoryId,
    type,
    description,
    scheduled_date,
    estimated_cost,
    equipment_inactive,
    notes,
    assignedToId,
  })

  return reply.status(201).send({ maintenance })
}
