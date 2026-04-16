import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateSupplier } from '../../../services/factories/make-create-supplier'

const createSupplierSchema = z.object({
  company_name: z.string().min(3),
  trading_name: z.string().nullable().optional(),

  cnpj: z.string().length(14),
  email: z.email(),
  phone: z.string().min(10).max(11),
  contact: z.string().min(5),

  isClient: z.boolean().optional(),

  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().max(2).nullable().optional(),
  zip_code: z.string().length(8).nullable().optional().or(z.literal("")),

  service_types: z.array(z.string()).min(1),
})

export async function createSupplier(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const parseBody = createSupplierSchema.parse(request.body)

  const createSupplier = makeCreateSupplier()

  const { supplier } = await createSupplier.execute(parseBody)

  return reply.status(201).send(supplier)
}
