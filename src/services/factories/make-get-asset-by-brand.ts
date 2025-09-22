import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { GetAssetByBrandUseCase } from '../asset/get-asset-by-brand-use-case'

export function makeGetAssetByBrand() {
  const assetRepository = new PrismaAssetRepository()
  const getAssetByBrandUseCase = new GetAssetByBrandUseCase(assetRepository)
  return getAssetByBrandUseCase
}
