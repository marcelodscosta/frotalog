import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeUpdateAsset } from '../../../services/factories/make-update-asset'

const AssetOwnershipSchema = z.enum(['OWN', 'THIRD'])

const updateBodySchema = z.object({
  brand: z.string().min(3),
  model: z.string().min(3),
  year: z.coerce.number().int().optional().nullable(),
  plate: z.string().optional().nullable(),
  serial_number: z.string().optional().nullable(),
  created_at: z.coerce.date().optional(),
  is_Active: z.boolean().optional(),
  assetCategoryId: z.uuid(),
  notes: z.string().optional().nullable(),

  ownership: AssetOwnershipSchema.default('OWN'),
  documentsUrl: z.url().nullable().optional(),

  // Usage Tracking
  initial_horometer: z.number().nullable().optional(),
  current_horometer: z.number().nullable().optional(),
  initial_odometer: z.number().nullable().optional(),
  current_odometer: z.number().nullable().optional(),

  // Maintenance Settings
  maintenance_frequency_hours: z.number().nullable().optional(),
  maintenance_frequency_km: z.number().nullable().optional(),
})

const updateParamsSchema = z.object({
  id: z.string(),
})

export async function updateAsset(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateParamsSchema.parse(request.params)
  const parsedData = updateBodySchema.parse(request.body)

  const data: typeof parsedData = { ...parsedData }

  if (parsedData.plate !== undefined) {
    data.plate =
      parsedData.plate !== null && parsedData.plate.trim() !== ''
        ? parsedData.plate.trim()
        : null
  }

  if (parsedData.serial_number !== undefined) {
    data.serial_number =
      parsedData.serial_number !== null &&
      parsedData.serial_number.trim() !== ''
        ? parsedData.serial_number.trim()
        : null
  }

  const updateAssetUseCase = makeUpdateAsset()
  const { asset } = await updateAssetUseCase.execute({ id, data })

  return reply.status(200).send(asset)
}
