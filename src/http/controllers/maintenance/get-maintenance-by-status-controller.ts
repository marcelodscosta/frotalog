import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetMaintenanceByStatus } from '../../../services/factories/make-get-maintenance-by-status'

export async function getMaintenancesByStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
    page: z.coerce.number().min(1).default(1),
  })

  const { status, page } = querySchema.parse(request.query)

  const getMaintenanceByStatus = makeGetMaintenanceByStatus()
  const result = await getMaintenanceByStatus.execute({ status, page })

  return reply.status(200).send(result)
}
