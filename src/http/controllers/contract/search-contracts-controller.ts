import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeSearchContracts } from '../../../services/factories/make-search-contracts'

const searchContractsSchema = z.object({
  contract_number: z.string().optional(),
  description: z.string().optional(),
  client: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'FINISHED', 'CANCELLED']).optional(),
  page: z.coerce.number().min(1).default(1),
})

export async function searchContracts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { contract_number, description, client, status, page } =
    searchContractsSchema.parse(request.query)

  const searchContractsUseCase = makeSearchContracts()
  const { contracts } = await searchContractsUseCase.execute({
    contract_number,
    description,
    client,
    status,
    page,
  })

  return reply.status(200).send(contracts)
}
