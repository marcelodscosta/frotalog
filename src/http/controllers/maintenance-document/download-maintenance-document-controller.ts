import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetMaintenanceDocumentById } from '../../../services/factories/make-get-maintenance-document-by-id'

export async function downloadMaintenanceDocument(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)

  const getMaintenanceDocumentById = makeGetMaintenanceDocumentById()
  const { document } = await getMaintenanceDocumentById.execute({ id })

  // file_path now stores the B2 public URL — redirect the client to it
  return reply.redirect(document.file_path)
}
