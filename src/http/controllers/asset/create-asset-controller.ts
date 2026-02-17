import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateAsset } from '../../../services/factories/make-create-asset'

export async function createAsset(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const AssetOwnershipSchema = z.enum(['OWN', 'THIRD'])

  const createBodySchema = z.object({
    brand: z.string().min(3),
    model: z.string().min(3),
    year: z.number().optional(),
    plate: z.string().nullable().optional(),
    serial_number: z.string().nullable().optional(),
    assetCategoryId: z.uuid(),
    ownership: AssetOwnershipSchema.default('OWN'),
    documentsUrl: z.url().nullable().optional(),
    notes: z.string().optional().nullable(),
    
    // Usage Tracking
    initial_horometer: z.number().nullable().optional(),
    current_horometer: z.number().nullable().optional(),
    initial_odometer: z.number().nullable().optional(),
    current_odometer: z.number().nullable().optional(),

    // Maintenance Settings
    maintenance_frequency_hours: z.number().nullable().optional(),
    maintenance_frequency_km: z.number().nullable().optional(),
  })

  const {
    brand,
    model,
    year,
    plate,
    serial_number,
    assetCategoryId,
    ownership,
    documentsUrl,
    notes,
    initial_horometer,
    current_horometer,
    initial_odometer,
    current_odometer,
    maintenance_frequency_hours,
    maintenance_frequency_km,
  } = createBodySchema.parse(request.body)

  const normalizedPlate =
    plate !== null && plate !== undefined && plate.trim() !== ''
      ? plate.trim()
      : null
  const normalizedSerialNumber =
    serial_number !== null &&
    serial_number !== undefined &&
    serial_number.trim() !== ''
      ? serial_number.trim()
      : null

  const createAsset = makeCreateAsset()
  const { asset } = await createAsset.execute({
    brand,
    model,
    year,
    plate: normalizedPlate,
    serial_number: normalizedSerialNumber,
    assetCategoryId,
    ownership,
    documentsUrl,
    notes,
    initial_horometer,
    current_horometer,
    initial_odometer,
    current_odometer,
    maintenance_frequency_hours,
    maintenance_frequency_km,
  })
  return reply.status(201).send({ asset })
}
