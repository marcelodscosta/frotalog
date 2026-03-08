import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFetchChecklists } from '../../../services/factories/make-fetch-checklists'

export async function fetchChecklistsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    assetId: z.string().uuid().optional(),
    type: z.enum(['MOBILIZATION', 'PERIODIC', 'DEMOBILIZATION']).optional(),
    status: z.enum(['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED']).optional(),
  })

  const filters = querySchema.parse(request.query)
  const useCase = makeFetchChecklists()
  const { checklists } = await useCase.execute(filters)

  return reply.status(200).send({ checklists })
}
