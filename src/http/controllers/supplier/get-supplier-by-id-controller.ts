import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetSupplierById } from '../../../services/factories/make-get-supplier-by-id copy'
import { z } from 'zod'

const getSupplierByIdSchema = z.object({
  id: z.string(),
})

export async function getSupplierById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getSuppliertUseCase = makeGetSupplierById()
  const { id } = getSupplierByIdSchema.parse(request.query)

  const { supplier } = await getSuppliertUseCase.execute({ id })

  return reply.status(200).send({ supplier })
}
