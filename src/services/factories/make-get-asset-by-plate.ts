import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { GetAssetByPlateUseCase } from '../asset/get-asset-by-plate-use-case'

export function makeGetAssetByPlate() {
  const assetRepository = new PrismaAssetRepository()
  const getAssetByPlateUseCase = new GetAssetByPlateUseCase(assetRepository)
  return getAssetByPlateUseCase
}
