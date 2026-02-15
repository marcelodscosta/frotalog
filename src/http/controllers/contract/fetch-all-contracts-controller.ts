import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFetchAllContracts } from '../../../services/factories/make-fetch-all-contracts'

export async function fetchAllContracts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchAllContractsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = fetchAllContractsQuerySchema.parse(request.query)

  const fetchAllContractsUseCase = makeFetchAllContracts()

  const { contracts } = await fetchAllContractsUseCase.execute({
    page,
  })

  return reply.status(200).send({ contracts })
}
