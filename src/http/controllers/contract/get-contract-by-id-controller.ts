import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetContract } from '../../../services/factories/make-get-contract-by-id'

const getContractByIdSchema = z.object({
  id: z.string('Invalid contract id'),
})

export async function getContractById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = getContractByIdSchema.parse(request.params)

  const getContractUseCase = makeGetContract()

  const { contract } = await getContractUseCase.execute({ id })

  return reply.status(200).send(contract)
}
