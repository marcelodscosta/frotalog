import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateSupplier } from '../../../services/factories/make-create-supplier'

const createSupplierSchema = z.object({
  company_name: z.string().min(3),
  trading_name: z.string().optional(),

  cnpj: z.string(),
  email: z.email(),
  phone: z.string(),
  contact: z.string().min(5),

  isClient: z.boolean().optional(),

  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),

  service_types: z.array(z.string()),
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
