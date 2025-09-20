import { Asset, Prisma } from '../../generated/prisma'

export interface IAssetRepository {
  create(data: Prisma.AssetUncheckedCreateInput): Promise<Asset>
  updateAsset(id: string, data: Prisma.AssetUpdateInput): Promise<Asset>

  findAll(page: number): Promise<Asset[]>

  findByBrand(brand: string, page: number): Promise<Asset[]>
  findByModel(model: string, page: number): Promise<Asset[]>

  findById(id: string): Promise<Asset | null>
  findByPlate(plate: string): Promise<Asset | null>
  findBySerialNumber(serialNumber: string): Promise<Asset | null>
}
