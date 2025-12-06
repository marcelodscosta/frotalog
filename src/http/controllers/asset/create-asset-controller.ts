import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateAsset } from '../../../services/factories/make-create-asset'

export async function createAsset(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createBodySchema = z.object({
    brand: z.string().min(3),
    model: z.string().min(3),
    year: z.number().optional(),
    plate: z.string().nullable().optional(),
    serial_number: z.string().nullable().optional(),
    assetCategoryId: z.uuid(),
  })

  const { brand, model, year, plate, serial_number, assetCategoryId } =
    createBodySchema.parse(request.body)

  // Converter strings vazias em null para campos opcionais com constraint única
  // Isso evita erro de constraint única quando múltiplos registros têm string vazia
  const normalizedPlate =
    plate !== null && plate !== undefined && plate.trim() !== '' ? plate.trim() : null
  const normalizedSerialNumber =
    serial_number !== null && serial_number !== undefined && serial_number.trim() !== ''
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
  })
  return reply.status(201).send({ asset })
}
