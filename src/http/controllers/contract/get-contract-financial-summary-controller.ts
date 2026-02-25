import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetContractFinancialSummary } from '../../../services/factories/make-get-contract-financial-summary'

const getContractFinancialSummarySchema = z.object({
  id: z.string('Invalid contract id'),
})

export async function getContractFinancialSummary(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = getContractFinancialSummarySchema.parse(request.params)

  const getContractFinancialSummaryUseCase = makeGetContractFinancialSummary()

  const { financialSummary } = await getContractFinancialSummaryUseCase.execute({ contractId: id })

  return reply.status(200).send(financialSummary)
}
