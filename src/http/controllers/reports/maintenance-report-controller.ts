import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeMaintenanceReport } from '../../../services/factories/make-maintenance-report'

export async function getMaintenanceReport(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
    type: z.enum(['PREVENTIVE', 'CORRECTIVE', 'EMERGENCY']).optional(),
    assetId: z.string().uuid().optional(),
    supplierId: z.string().uuid().optional(),
  })

  const filters = querySchema.parse(request.query)

  const maintenanceReport = makeMaintenanceReport()
  const report = await maintenanceReport.execute(filters)

  return reply.send({ report })
}
