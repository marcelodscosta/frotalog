import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetMaintenanceById } from '../../../services/factories/make-get-maintenance-by-id'

export async function getMaintenanceById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string(),
  })

  const { id } = paramsSchema.parse(request.params)

  const getMaintenanceById = makeGetMaintenanceById()
  const { maintenance } = await getMaintenanceById.execute({ id })

  return reply.send(maintenance)
}
