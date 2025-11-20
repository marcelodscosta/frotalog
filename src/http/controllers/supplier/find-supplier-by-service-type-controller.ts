import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFindSupplierByServiceType } from '../../../services/factories/make-find-supplier-by-service-type'
import { z } from 'zod'

const findSupplierByServiceTypeSchema = z.object({
  serviceType: z.string().min(1),
  page: z.coerce.number().default(1),
})

export async function findSupplierByServiceType(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { serviceType, page } = findSupplierByServiceTypeSchema.parse(
    request.query,
  )

  const findSupplierByServiceTypeUseCase = makeFindSupplierByServiceType()

  const result = await findSupplierByServiceTypeUseCase.execute({
    serviceType,
    page,
  })

  return reply.status(200).send(result)
}
