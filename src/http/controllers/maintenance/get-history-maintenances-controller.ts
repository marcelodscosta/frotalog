import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeGetHistoryMaintenancesUseCase } from '../../../services/factories/make-get-history-maintenances-use-case'

export async function getHistoryMaintenances(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    year: z.coerce.number().optional(),
    month: z.coerce.number().min(1).max(12).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    assignedToId: z.string().optional(),
  })

  const { year, month, startDate, endDate, assignedToId } = querySchema.parse(request.query)

  const now = new Date()
  let finalStartDate = startDate
  let finalEndDate = endDate

  if (!startDate && !endDate) {
    const targetYear = year || now.getFullYear()
    const targetMonth = month ? month - 1 : now.getMonth()
    finalStartDate = new Date(targetYear, targetMonth, 1)
    finalEndDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59)
  }

  const getHistoryMaintenances = makeGetHistoryMaintenancesUseCase()
  const result = await getHistoryMaintenances.execute({
    startDate: finalStartDate,
    endDate: finalEndDate,
    assignedToId,
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
