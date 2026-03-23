import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFindAllMaintenance } from '../../../services/factories/make-find-all-maintenance'

export async function findAllMaintenances(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    status: z.string().optional(),
    type: z.string().optional(),
    plate: z.string().optional(),
    serialNumber: z.string().optional(),
    contractStatus: z.string().optional(),
  })

  const validatedParams = querySchema.parse(request.query)

  const findAllMaintenances = makeFindAllMaintenance()
  const result = await findAllMaintenances.execute(validatedParams)

  return reply.status(200).send(result)
}
