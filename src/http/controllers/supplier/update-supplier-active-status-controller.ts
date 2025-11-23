import { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'

import { makeUpdateSupplierIsActiveStatus } from '../../../services/factories/make-update-supplier-is-active-status'

const updateBodySchema = z.object({
  is_Active: z.boolean(),
})

const updateParamsSchema = z.object({
  id: z.string(),
})

export async function updateSupplierActive(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateParamsSchema.parse(request.params)

  const { is_Active } = updateBodySchema.parse(request.body)

  const updateSupplierIsActiveStatusUseCase = makeUpdateSupplierIsActiveStatus()
  const { supplier } = await updateSupplierIsActiveStatusUseCase.execute({
    id,
    data: is_Active,
  })
  return reply.status(200).send(supplier)
}
