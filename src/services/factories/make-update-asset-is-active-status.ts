import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { UpdateAssetActiveStatusUseCase } from '../asset/update-asset-active-status.use-case'

export function makeUpdateAssetIsActiveStatus() {
  const assetRepository = new PrismaAssetRepository()
  const updateAssetActiveStatusUseCase = new UpdateAssetActiveStatusUseCase(
    assetRepository,
  )
  return updateAssetActiveStatusUseCase
}
