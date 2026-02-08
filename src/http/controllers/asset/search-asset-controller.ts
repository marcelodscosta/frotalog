import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeSearchAsset } from '../../../services/factories/make-search-asset'

export async function searchAssets(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchAssetQuerySchema = z.object({
    brand: z.string().optional(),
    model: z.string().optional(),
    plate: z.string().optional(),
    serial_number: z.string().optional(),
    ownership: z.enum(['OWN', 'THIRD']).optional(),
    assetCategoryId: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
  })

  const {
    brand,
    model,
    plate,
    serial_number,
    ownership,
    assetCategoryId,
    page,
  } = searchAssetQuerySchema.parse(request.query)

  const searchAssetUseCase = makeSearchAsset()

  const { assets, currentPage, pageSize, totalItems, totalPages } =
    await searchAssetUseCase.execute({
      brand,
      model,
      plate,
      serial_number,
      ownership,
      assetCategoryId,
      page,
    })

  return reply.status(200).send({
    assets,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
  })
}
