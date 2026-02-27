import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateMaintenanceDocument } from '../../../services/factories/make-create-maintenance-document'

export async function createMaintenanceDocumentUrl(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    maintenanceId: z.string().uuid(),
  })

  const bodySchema = z.object({
    filename: z.string().min(1),
    original_name: z.string().min(1),
    file_path: z.string().url(),
    file_size: z.number().int().positive(),
    mime_type: z.string().min(1),
    description: z.string().optional(),
  })

  const { maintenanceId } = paramsSchema.parse(request.params)
  const data = bodySchema.parse(request.body)

  const createMaintenanceDocument = makeCreateMaintenanceDocument()
  const { document } = await createMaintenanceDocument.execute({
    maintenanceId,
    filename: data.filename,
    original_name: data.original_name,
    file_path: data.file_path,
    file_size: data.file_size,
    mime_type: data.mime_type,
    description: data.description,
  })

  return reply.status(201).send({ document })
}
