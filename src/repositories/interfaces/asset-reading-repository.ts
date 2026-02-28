import { AssetReading, Prisma } from '../../generated/prisma'

export interface AssetReadingRepository {
  create(data: Prisma.AssetReadingUncheckedCreateInput): Promise<AssetReading>
}
