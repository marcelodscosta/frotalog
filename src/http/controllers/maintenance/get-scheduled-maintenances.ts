import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetScheduledMaintenancesUseCase } from '../../../services/factories/make-get-scheduled-maintenances-use-case'

export async function getScheduledMaintenances(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    year: z.coerce.number().default(new Date().getFullYear()),
    month: z.coerce.number().min(1).max(12).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  })

  const { year, month, startDate, endDate } = querySchema.parse(request.query)

  let finalStartDate = startDate
  let finalEndDate = endDate

  if (!startDate && !endDate) {
    if (month) {
      finalStartDate = new Date(year, month - 1, 1)
      finalEndDate = new Date(year, month, 0, 23, 59, 59)
    } else {
      finalStartDate = new Date(year, 0, 1)
      finalEndDate = new Date(year, 11, 31, 23, 59, 59)
    }
  }

  const getScheduledMaintenances = makeGetScheduledMaintenancesUseCase()
  const result = await getScheduledMaintenances.execute({
    startDate: finalStartDate,
    endDate: finalEndDate,
  })

  return reply.status(200).send({
    data: result,
    period: {
      startDate: finalStartDate?.toISOString(),
      endDate: finalEndDate?.toISOString(),
    },
    meta: {
      generatedAt: new Date().toISOString(),
      totalRecords: result.summary.total,
    },
  })
}
