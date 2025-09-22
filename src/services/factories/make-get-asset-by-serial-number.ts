import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { GetAssetBySerialNumberUseCase } from '../asset/get-asset-by-serial-number-use-case'

export function makeGetAssetBySerialNumber() {
  const assetRepository = new PrismaAssetRepository()
  const getAssetBySerialNumberUseCase = new GetAssetBySerialNumberUseCase(
    assetRepository,
  )
  return getAssetBySerialNumberUseCase
}
