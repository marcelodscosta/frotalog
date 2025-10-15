import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFindAllSupplier } from '../../../services/factories/make-find-all-supplier'

const findAllSupplierSchema = z.object({
  page: z.coerce.number().min(1).default(1),
})

export async function findAllSupplier(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { page } = findAllSupplierSchema.parse(request.query)
  console.log(page)
  const findAllSupplierUseCase = makeFindAllSupplier()

  const result = await findAllSupplierUseCase.execute({ page })

  return reply.status(200).send(result)
}
