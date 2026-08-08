import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeDeleteInvoiceDocument } from '../../../services/factories/make-delete-invoice-document'
import { deleteFromB2, getKeyFromUrl } from '../../../lib/storage'
import { PrismaInvoiceDocumentRepository } from '../../../repositories/prisma/prisma-invoice-document-repository'

export async function deleteInvoiceDocumentController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    documentId: z.string().uuid(),
  })

  const { documentId } = paramsSchema.parse(request.params)

  const repo = new PrismaInvoiceDocumentRepository()
  const document = await repo.findById(documentId)

  if (!document) {
    return reply.status(404).send({ message: 'Document not found' })
  }

  try {
    if (document.file_path) {
      const key = getKeyFromUrl(document.file_path)
      if (key) {
        await deleteFromB2(key)
      }
    }
    
    const useCase = makeDeleteInvoiceDocument()
    await useCase.execute({ documentId })

    return reply.status(204).send()
  } catch (error: any) {
    return reply.status(500).send({ message: error.message || 'Error deleting invoice document' })
  }
}
