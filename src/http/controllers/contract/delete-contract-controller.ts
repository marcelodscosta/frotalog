import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeDeleteContract } from '../../../services/factories/make-delete-contract'

const deleteContractSchema = z.object({
  id: z.string('Invalid contract id'),
})

export async function deleteContract(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = deleteContractSchema.parse(request.params)

  const deleteContractUseCase = makeDeleteContract()

  const { contract } = await deleteContractUseCase.execute({ id })

  return reply.status(200).send(contract)
}
