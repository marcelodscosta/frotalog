import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFetchContractsByClient } from '../../../services/factories/make-fetch-contracts-by-client'

export async function fetchContractsByClient(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchContractsByClientQuerySchema = z.object({
    client: z.string().min(1, 'Client name is required'),
    page: z.coerce.number().min(1).default(1),
  })

  const { client, page } = fetchContractsByClientQuerySchema.parse(
    request.query,
  )

  const fetchContractsByClientUseCase = makeFetchContractsByClient()

  const { contracts } = await fetchContractsByClientUseCase.execute({
    client,
    page,
  })

  return reply.status(200).send({ contracts })
}
