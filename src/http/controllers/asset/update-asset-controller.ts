import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeUpdateAsset } from '../../../services/factories/make-update-asset'

const updateBodySchema = z.object({
  brand: z.string().min(3),
  model: z.string().min(3),
  year: z.coerce.number().int().optional().nullable(),

  plate: z.string().optional().nullable(),
  serial_number: z.string().optional().nullable(),

  created_at: z.date().optional(),
  is_Active: z.boolean().optional(),
  assetCategoryId: z.uuid(),
})

const updateParamsSchema = z.object({
  id: z.string(),
})

export async function updateAsset(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateParamsSchema.parse(request.query)
  const data = updateBodySchema.parse(request.body)

  const updateAssetUseCase = makeUpdateAsset()
  const { asset } = await updateAssetUseCase.execute({ id, data })

  return reply.status(200).send(asset)
}
