import { Asset, Prisma } from '../../generated/prisma'

export interface IAssetRepository {
  create(data: Prisma.AssetUncheckedCreateInput): Promise<Asset>
}
