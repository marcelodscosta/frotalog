import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetMaintenanceByPlate } from '../../../services/factories/make-get-maintenance-by-plate'

export async function getMaintenancesByPlate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    plate: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { plate, page } = querySchema.parse(request.query)

  const getMaintenanceByPlate = makeGetMaintenanceByPlate()
  const result = await getMaintenanceByPlate.execute({ plate, page })

  return reply.status(200).send(result)
}
