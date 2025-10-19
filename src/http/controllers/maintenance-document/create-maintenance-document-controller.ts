import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateMaintenanceDocument } from '../../../services/factories/make-create-maintenance-document'
import { randomUUID } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'

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

  // Validar tamanho do arquivo (10MB)
  const maxFileSize = 10 * 1024 * 1024 // 10MB
  if (data.file.bytesRead > maxFileSize) {
    return reply.status(400).send({ 
      message: 'File too large. Maximum size is 10MB' 
    })
  }

  // Criar diretório de uploads se não existir
  const uploadsDir = path.join(process.cwd(), 'uploads', 'maintenance-documents')
  await fs.mkdir(uploadsDir, { recursive: true })

  // Gerar nome único para o arquivo
  const fileExtension = path.extname(data.filename)
  const uniqueFilename = `${randomUUID()}${fileExtension}`
  const filePath = path.join(uploadsDir, uniqueFilename)

  // Salvar arquivo
  const buffer = await data.toBuffer()
  await fs.writeFile(filePath, buffer)

  const createMaintenanceDocument = makeCreateMaintenanceDocument()
  const { document } = await createMaintenanceDocument.execute({
    maintenanceId,
    filename: uniqueFilename,
    original_name: data.filename,
    file_path: filePath,
    file_size: data.file.bytesRead,
    mime_type: data.mimetype,
    description: data.fields?.description?.value as string,
  })

  return reply.status(201).send({ document })
}
