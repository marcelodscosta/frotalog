import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetMaintenanceByType } from '../../../services/factories/make-get-maintenance-by-type'

export async function getMaintenancesByType(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    type: z.enum(['PREVENTIVE', 'CORRECTIVE', 'EMERGENCY']),
    page: z.coerce.number().min(1).default(1),
  })

  const { type, page } = querySchema.parse(request.query)

  const getMaintenancesByType = makeGetMaintenanceByType()
  const result = await getMaintenancesByType.execute({ type, page })

  return reply.status(200).send(result)
}
