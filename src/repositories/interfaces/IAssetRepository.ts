import { Asset, Prisma } from '../../generated/prisma'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export interface IAssetRepository {
  create(data: Prisma.AssetUncheckedCreateInput): Promise<Asset>
  updateAsset(id: string, data: Prisma.AssetUpdateInput): Promise<Asset>

  updateAssetIsActive(id: string, data: boolean): Promise<Asset>

  findAll(page: number): Promise<PaginatedResult<Asset>>

  findByBrand(brand: string, page: number): Promise<PaginatedResult<Asset>>
  findByModel(model: string, page: number): Promise<PaginatedResult<Asset>>

  findById(id: string): Promise<Asset | null>
  findByPlate(plate: string): Promise<Asset | null>
  findBySerialNumber(serialNumber: string): Promise<Asset | null>

  findAllUnpaginated(): Promise<Asset[]>

  search(params: {
    brand?: string
    model?: string
    plate?: string
    serial_number?: string
    ownership?: 'OWN' | 'THIRD'
    assetCategoryId?: string
    page: number
  }): Promise<PaginatedResult<Asset>>
}
