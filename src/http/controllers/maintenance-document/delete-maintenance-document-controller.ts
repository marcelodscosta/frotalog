import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeDeleteMaintenanceDocument } from '../../../services/factories/make-delete-maintenance-document'
import { makeGetMaintenanceDocumentById } from '../../../services/factories/make-get-maintenance-document-by-id'
import { promises as fs } from 'fs'

export async function deleteMaintenanceDocument(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)

  // Buscar documento para obter o caminho do arquivo
  const getMaintenanceDocumentById = makeGetMaintenanceDocumentById()
  const { document } = await getMaintenanceDocumentById.execute({ id })

  // Deletar do banco de dados
  const deleteMaintenanceDocument = makeDeleteMaintenanceDocument()
  await deleteMaintenanceDocument.execute({ id })

  // Deletar arquivo físico
  try {
    await fs.unlink(document.file_path)
  } catch (error) {
    // Log do erro mas não falha a operação se o arquivo não existir
    console.warn(`Failed to delete file: ${document.file_path}`, error)
  }

  return reply.status(204).send()
}
