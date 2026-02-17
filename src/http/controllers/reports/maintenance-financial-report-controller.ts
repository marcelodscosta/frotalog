import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { MaintenanceFinancialReportUseCase } from '../../../services/reports/maintenance-financial-report'

export async function getMaintenanceFinancialReport(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    groupBy: z.enum(['ASSET', 'SUPPLIER']).optional().default('ASSET'),
  })

  const { startDate, endDate, groupBy } = querySchema.parse(request.query)

  const useCase = new MaintenanceFinancialReportUseCase()

  const { report, totalOverall } = await useCase.execute({
    startDate,
    endDate,
    groupBy,
  })

  return reply.status(200).send({ report, totalOverall })
}
