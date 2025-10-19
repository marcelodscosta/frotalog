import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFindAllMaintenanceDocument } from '../../../services/factories/make-find-all-maintenance-document'

export async function findAllMaintenanceDocuments(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = querySchema.parse(request.query)

  const findAllMaintenanceDocuments = makeFindAllMaintenanceDocument()
  const { documents } = await findAllMaintenanceDocuments.execute({ page })

  return reply.send({ documents })
}
