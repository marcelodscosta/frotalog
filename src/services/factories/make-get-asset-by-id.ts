import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { GetAssetByIdUseCase } from '../asset/get-asset-by-id-use-case'

export function makeGetAssetById() {
  const assetRepository = new PrismaAssetRepository()
  const getAssetByIdUseCase = new GetAssetByIdUseCase(assetRepository)
  return getAssetByIdUseCase
}
