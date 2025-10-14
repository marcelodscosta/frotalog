import { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'

import { makeUpdateSupplier } from '../../../services/factories/make-update-supplier'
import { isValidCNPJ } from '../../../utils/cnpjValidate'

const updateBodySchema = z.object({
  company_name: z.string().min(3).optional(),
  trading_name: z.string().optional(),
  cnpj: z
    .string()
    .refine(isValidCNPJ, {
      message: 'Invalid CNPJ',
    })
    .optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  contact: z.string().min(5).optional(),

  adrdress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z
    .string()
    .regex(/^\d{5}-\d{3}$/, 'Invalid zip code')
    .optional(),

  service_types: z.array(z.string()).optional(),
})

const updateParamsSchema = z.object({
  id: z.string(),
})

export async function updateSupplier(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateParamsSchema.parse(request.query)
  const data = updateBodySchema.parse(request.body)

  const updateSupplierUseCase = makeUpdateSupplier()
  const { supplier } = await updateSupplierUseCase.execute({
    id,
    data,
  })
  return reply.status(200).send(supplier)
}
