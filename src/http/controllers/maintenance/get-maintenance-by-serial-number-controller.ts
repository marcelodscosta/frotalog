import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetMaintenanceBySerialNumber } from '../../../services/factories/make-get-maintenance-by-serial-number'

export async function getMaintenancesBySerialNumber(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    serialNumber: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { serialNumber, page } = querySchema.parse(request.query)

  const getMaintenanceBySerialNumber = makeGetMaintenanceBySerialNumber()
  const result = await getMaintenanceBySerialNumber.execute({
    serialNumber,
    page,
  })

  return reply.status(200).send(result)
}
