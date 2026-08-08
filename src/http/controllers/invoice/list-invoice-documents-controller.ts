import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeListInvoiceDocuments } from '../../../services/factories/make-list-invoice-documents'

export async function listInvoiceDocumentsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    invoiceId: z.string().uuid(),
  })

  const { invoiceId } = paramsSchema.parse(request.params)

  const useCase = makeListInvoiceDocuments()
  const { documents } = await useCase.execute({ invoiceId })

  return reply.send({ documents })
}
