import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetContractByContractNumber } from '../../../services/factories/make-get-contract-by-contract-number'

const getContractByContractNumberSchema = z.object({
  contract_number: z.string('Invalid contract number'),
})

export async function getContractByNumber(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { contract_number } = getContractByContractNumberSchema.parse(
    request.query,
  )

  const getContractUseCase = makeGetContractByContractNumber()

  const { contract } = await getContractUseCase.execute({ contract_number })

  return reply.status(200).send(contract)
}
