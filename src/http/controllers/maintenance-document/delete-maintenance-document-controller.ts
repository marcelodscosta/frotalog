import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeDeleteMaintenanceDocument } from '../../../services/factories/make-delete-maintenance-document'
import { makeGetMaintenanceDocumentById } from '../../../services/factories/make-get-maintenance-document-by-id'
import { deleteFromB2, getKeyFromUrl } from '../../../lib/storage'

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
  const deleteMaintenanceDocumentService = makeDeleteMaintenanceDocument()
  await deleteMaintenanceDocumentService.execute({ id })

  // Deletar arquivo do B2
  try {
    const key = getKeyFromUrl(document.file_path)
    if (key) {
      await deleteFromB2(key)
    }
  } catch (error) {
    console.warn(`Failed to delete file from B2: ${document.file_path}`, error)
  }

  return reply.status(204).send()
}
