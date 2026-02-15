import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { GetActiveContractByAssetUseCase } from '../contract/get-active-contract-by-asset-use-case'

export function makeGetActiveContractByAsset() {
  const contractRepository = new PrismaContractRepository()
  const getActiveContractByAssetUseCase = new GetActiveContractByAssetUseCase(
    contractRepository,
  )

  return getActiveContractByAssetUseCase
}
