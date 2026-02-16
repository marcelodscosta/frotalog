import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFindAllClientsUnpaginated } from '../../../services/factories/make-find-all-clients-unpaginated'

export async function findAllClientsUnpaginated(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const findAllClientsUnpaginatedUseCase = makeFindAllClientsUnpaginated()

  const { clients } = await findAllClientsUnpaginatedUseCase.execute()

  return reply.status(200).send(clients)
}
