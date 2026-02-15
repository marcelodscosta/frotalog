import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdateContract } from '../../../services/factories/make-update-contract'

export async function updateContract(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateParamsSchema = z.object({
    id: z.string('Invalid contract id'),
  })

  const updateBodySchema = z.object({
    contract_number: z.string().min(5).optional(),
    description: z.string().nullable().optional(),
    clientId: z.string().optional(),
    responsible_name: z.string().nullable().optional(),
    responsible_phone: z.string().nullable().optional(),
    responsible_email: z.string().email().nullable().optional(),
    start_date: z.coerce.date().optional(),
    end_date: z.coerce.date().nullable().optional(),
    status: z.enum(['DRAFT', 'ACTIVE', 'FINISHED', 'CANCELLED']).optional(),
    total_value: z.number().nonnegative().nullable().optional(),
    billing_day: z.number().int().min(1).max(31).nullable().optional(),
    notes: z.string().nullable().optional(),
    is_Active: z.boolean().optional(),
  })

  const { id } = updateParamsSchema.parse(request.params)
  const data = updateBodySchema.parse(request.body)

  const updateContractUseCase = makeUpdateContract()

  const { contract } = await updateContractUseCase.execute({
    id,
    ...data,
  })

  return reply.status(200).send({ contract })
}
