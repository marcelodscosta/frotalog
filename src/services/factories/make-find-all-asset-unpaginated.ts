import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { FindAllAssetUnpaginatedUseCase } from '../asset/find-all-asset-unpaginated-use-case'

export function makeFindAllAssetUnpaginated() {
  const assetRepository = new PrismaAssetRepository()
  const findAllAssetUnpaginatedUseCase = new FindAllAssetUnpaginatedUseCase(
    assetRepository,
  )
  return findAllAssetUnpaginatedUseCase
}
