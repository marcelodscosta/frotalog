import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateContract } from '../../../services/factories/make-create-contract'

export async function createContract(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createBodySchema = z.object({
    contract_number: z.string().min(5, 'Contract number is required'),
    description: z.string().nullable().optional(),
    clientId: z.string('Invalid client id'),
    responsible_name: z.string().nullable().optional(),
    responsible_phone: z.string().nullable().optional(),
    responsible_email: z.email('Invalid email').nullable().optional(),
    start_date: z.coerce.date(),
    end_date: z.coerce.date().nullable().optional(),
    total_value: z.number().nonnegative().nullable().optional(),
    billing_day: z.number().int().min(1).max(31).nullable().optional(),
    notes: z.string().nullable().optional(),
  })

  const data = createBodySchema.parse(request.body)

  const createContract = makeCreateContract()

  const { contract } = await createContract.execute(data)

  return reply.status(201).send({ contract })
}
