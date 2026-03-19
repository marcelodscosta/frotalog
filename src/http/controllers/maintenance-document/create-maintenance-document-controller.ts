import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateMaintenanceDocument } from '../../../services/factories/make-create-maintenance-document'
import { uploadToB2 } from '../../../lib/storage'

export async function createMaintenanceDocument(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = await request.file()

  if (!data) {
    return reply.status(400).send({ message: 'No file uploaded' })
  }

  const paramsSchema = z.object({
    maintenanceId: z.string().uuid(),
  })

  const { maintenanceId } = paramsSchema.parse(request.params)

  // Validar tipo de arquivo
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]

  if (!allowedMimeTypes.includes(data.mimetype)) {
    return reply.status(400).send({ 
      message: 'Invalid file type. Only PDF, images and documents are allowed' 
    })
  }

  const buffer = await data.toBuffer()

  // Validar tamanho do arquivo (10MB)
  const maxFileSize = 10 * 1024 * 1024
  if (buffer.length > maxFileSize) {
    return reply.status(400).send({ 
      message: 'File too large. Maximum size is 10MB' 
    })
  }

  const { url, key } = await uploadToB2(buffer, data.filename, data.mimetype, 'maintenance-documents')

  const createMaintenanceDocumentService = makeCreateMaintenanceDocument()
  const { document } = await createMaintenanceDocumentService.execute({
    maintenanceId,
    filename: key.split('/').pop() || data.filename,
    original_name: data.filename,
    file_path: url,
    file_size: buffer.length,
    mime_type: data.mimetype,
    description: (data.fields as any)?.description?.value as string,
  })

  return reply.status(201).send({ document })
}
