import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetMaintenanceDocumentsByMaintenance } from '../../../services/factories/make-get-maintenance-documents-by-maintenance'

export async function getMaintenanceDocumentsByMaintenance(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    maintenanceId: z.string().uuid(),
  })

  const querySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { maintenanceId } = paramsSchema.parse(request.params)
  const { page } = querySchema.parse(request.query)

  const getMaintenanceDocumentsByMaintenance = makeGetMaintenanceDocumentsByMaintenance()
  const { documents } = await getMaintenanceDocumentsByMaintenance.execute({ 
    maintenanceId, 
    page 
  })

  return reply.send({ documents })
}
