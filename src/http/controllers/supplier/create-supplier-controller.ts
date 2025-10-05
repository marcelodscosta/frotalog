import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateSupplier } from '../../../services/factories/make-create-supplier'
import { isValidCNPJ } from '../../../utils/cnpjValidate'

const createSupllierSchema = z.object({
  company_name: z.string().min(3),
  trading_name: z.string().optional(),
  cnpj: z.string().refine(isValidCNPJ, {
    message: 'Invalid CNPJ',
  }),
  email: z.email(),
  phone: z.string(),
  contact: z.string().min(5),

  adrdress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z
    .string()
    .regex(/^\d{5}-\d{3}$/, 'Invalid zip code')
    .optional(),

  service_types: z.array(z.string()),
})

export async function createSupplier(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const parseBody = createSupllierSchema.parse(request.body)

  const createSupplier = makeCreateSupplier()

  const { supplier } = await createSupplier.execute(parseBody)

  return replay.status(201).send(supplier)
}
