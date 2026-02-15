import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetContractWithDetails } from '../../../services/factories/make-get-contract-with-details'

export async function getContractWithDetails(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getContractWithDetailsParamsSchema = z.object({
    id: z.string('Invalid contract id'),
  })

  const { id } = getContractWithDetailsParamsSchema.parse(request.params)

  const getContractWithDetailsUseCase = makeGetContractWithDetails()

  const { contract } = await getContractWithDetailsUseCase.execute({
    id,
  })

  return reply.status(200).send({ contract })
}
