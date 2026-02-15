import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchAllContractsUnpaginated } from '../../../services/factories/make-fetch-all-contracts-unpaginated'

export async function fetchAllContractsUnpaginated(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchAllContractsUnpaginatedUseCase = makeFetchAllContractsUnpaginated()

  const { contracts } = await fetchAllContractsUnpaginatedUseCase.execute()

  return reply.status(200).send(contracts)
}
