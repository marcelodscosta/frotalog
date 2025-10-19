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
    plate: z.string().optional(),
    serial_number: z.string().optional(),
    assetCategoryId: z.uuid(),
  })

  const { brand, model, year, plate, serial_number, assetCategoryId } =
    createBodySchema.parse(request.body)

  const createAsset = makeCreateAsset()
  const { asset } = await createAsset.execute({
    brand,
    model,
    year,
    plate,
    serial_number,
    assetCategoryId,
  })
  return reply.status(201).send({ asset })
}
