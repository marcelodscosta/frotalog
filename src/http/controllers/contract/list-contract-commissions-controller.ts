import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeListContractCommissions } from '../../../services/factories/make-list-contract-commissions'

export async function listContractCommissions(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().uuid() })
  const { id } = paramsSchema.parse(request.params)

  const useCase = makeListContractCommissions()
  const result = await useCase.execute({ contractId: id })

  return reply.status(200).send(result)
}
