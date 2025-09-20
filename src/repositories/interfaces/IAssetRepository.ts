import { Asset, Prisma } from '../../generated/prisma'

export interface IAssetRepository {
  create(data: Prisma.AssetUncheckedCreateInput): Promise<Asset>
  findById(id: string): Promise<Asset | null>
  // searchAssets(query: string, page: number): Promise<Asset[]>
  // updateAsset(id: string, data: Prisma.AssetUpdateInput): Promise<Asset>

  // findByPlate(plate: string): Promise<Asset | null>
  // findBySerialNumber(serialNumber: string): Promise<Asset | null>
}
