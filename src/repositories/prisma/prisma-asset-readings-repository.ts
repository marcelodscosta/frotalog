import { Prisma } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { AssetReadingRepository } from '../interfaces/asset-reading-repository'

export class PrismaAssetReadingsRepository implements AssetReadingRepository {
  async create(data: Prisma.AssetReadingUncheckedCreateInput) {
    const assetReading = await prisma.assetReading.create({
      data,
    })

    return assetReading
  }
}
