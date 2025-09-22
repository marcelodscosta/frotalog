import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { GetAssetByModelUseCase } from '../asset/get-asset-by-model-use-case'

export function makeGetAssetByModel() {
  const assetRepository = new PrismaAssetRepository()
  const getAssetByModelUseCase = new GetAssetByModelUseCase(assetRepository)
  return getAssetByModelUseCase
}
