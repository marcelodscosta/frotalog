import { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'

import { makeUpdateSupplier } from '../../../services/factories/make-update-supplier'

const updateBodySchema = z.object({
  company_name: z.string().min(3).optional(),
  trading_name: z.string().nullable().optional(),
  isClient: z.boolean().optional(),
  cnpj: z.string().length(14).optional(),
  email: z.email().optional(),
  phone: z.string().min(10).max(11).optional(),
  contact: z.string().min(5).optional(),

  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().max(2).nullable().optional(),
  zip_code: z.string().length(8).nullable().optional().or(z.literal("")),

  service_types: z.array(z.string()).min(1).optional(),
})

const updateParamsSchema = z.object({
  id: z.string(),
})

export async function updateSupplier(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateParamsSchema.parse(request.params)

  const data = updateBodySchema.parse(request.body)

  const updateSupplierUseCase = makeUpdateSupplier()
  const { supplier } = await updateSupplierUseCase.execute({
    id,
    data,
  })
  return reply.status(200).send(supplier)
}
