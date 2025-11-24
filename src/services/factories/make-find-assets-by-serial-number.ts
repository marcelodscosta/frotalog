import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { FindAssetsBySerialNumberUseCase } from '../asset/find-assets-by-serial-number-use-case'

export function makeFindAssetsBySerialNumber() {
  const assetRepository = new PrismaAssetRepository()
  const findAssetsBySerialNumberUseCase = new FindAssetsBySerialNumberUseCase(assetRepository)

  return findAssetsBySerialNumberUseCase
}

