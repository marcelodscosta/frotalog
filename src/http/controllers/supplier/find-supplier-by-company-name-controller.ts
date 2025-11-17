import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFindSupplierByCompanyName } from '../../../services/factories/make-find-supplier-by-company-name'
import { z } from 'zod'

const findSupplierByCompanyNameSchema = z.object({
  query: z.string().min(3),
  page: z.coerce.number().default(1),
})

export async function findSupplierByCompanyName(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const { query, page } = findSupplierByCompanyNameSchema.parse(request.query)

  const findSupplierByCompanyNameUseCase = makeFindSupplierByCompanyName()

  const result = await findSupplierByCompanyNameUseCase.execute({
    query,
    page,
  })

  return replay.status(200).send(result)
}
