import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { CreateAssetReadingUseCase } from '../../../services/operational/create-asset-reading-use-case'
import { PrismaAssetRepository } from '../../../repositories/prisma/prisma-asset-repository'
import { PrismaAssetReadingsRepository } from '../../../repositories/prisma/prisma-asset-readings-repository'

export async function createAssetReading(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createAssetReadingBodySchema = z.object({
    assetId: z.string().uuid(),
    date: z.coerce.date(),
    horometer: z.number().nullable().optional(),
    odometer: z.number().nullable().optional(),
    notes: z.string().nullable().optional(),
  })

  const { assetId, date, horometer, odometer, notes } =
    createAssetReadingBodySchema.parse(request.body)

  const assetRepository = new PrismaAssetRepository()
  const assetReadingsRepository = new PrismaAssetReadingsRepository()
  const createAssetReadingUseCase = new CreateAssetReadingUseCase(
    assetRepository,
    assetReadingsRepository
  )

  const { reading } = await createAssetReadingUseCase.execute({
    assetId,
    date,
    horometer,
    odometer,
    notes,
    userId: request.user?.id,
  })

  return reply.status(201).send({ reading })
}
