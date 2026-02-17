import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateMaintenanceStatus } from '../../../services/factories/make-update-maintenance-status'

export async function updateMaintenanceStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const bodySchema = z.object({
    status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
    actual_cost: z.number().positive().optional(),
    horometer: z.number().nonnegative().optional(), // ✅ NOVO
    odometer: z.number().nonnegative().optional(), // ✅ NOVO
  })

  const { id } = paramsSchema.parse(request.params)
  const { status, actual_cost, horometer, odometer } = bodySchema.parse(request.body)

  const updateMaintenanceStatus = makeUpdateMaintenanceStatus()
  const { maintenance } = await updateMaintenanceStatus.execute({ 
    id, 
    status, 
    actual_cost,
    horometer,
    odometer
  })

  return reply.send({ maintenance })
}
