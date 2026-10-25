import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeConvertProposalToContract } from '../../../services/factories/make-convert-proposal-to-contract'

export async function convertProposalToContract(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    proposalId: z.string().uuid(),
    contract_number: z.string(),
    start_date: z.coerce.date(),
    type: z.enum(['NORMAL', 'SIMPLE']).optional().default('NORMAL'),
  })

  const { proposalId, contract_number, start_date, type } = bodySchema.parse(request.body)

  const convertProposalToContractUseCase = makeConvertProposalToContract()

  const { contract } = await convertProposalToContractUseCase.execute({
    proposalId,
    contract_number,
    start_date,
    type,
  })

  return reply.status(201).send({ contract })
}
