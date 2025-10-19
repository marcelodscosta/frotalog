import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetMaintenanceDocumentById } from '../../../services/factories/make-get-maintenance-document-by-id'
import { promises as fs } from 'fs'

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

  try {
    // Verificar se o arquivo existe
    await fs.access(document.file_path)

    // Definir headers para download
    reply.header('Content-Disposition', `attachment; filename="${document.original_name}"`)
    reply.header('Content-Type', document.mime_type)
    reply.header('Content-Length', document.file_size.toString())

    // Enviar arquivo
    return reply.send(await fs.readFile(document.file_path))
  } catch (error) {
    return reply.status(404).send({ message: 'File not found' })
  }
}
