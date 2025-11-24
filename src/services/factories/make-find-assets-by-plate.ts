import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { FindAssetsByPlateUseCase } from '../asset/find-assets-by-plate-use-case'

export function makeFindAssetsByPlate() {
  const assetRepository = new PrismaAssetRepository()
  const findAssetsByPlateUseCase = new FindAssetsByPlateUseCase(assetRepository)

  return findAssetsByPlateUseCase
}

