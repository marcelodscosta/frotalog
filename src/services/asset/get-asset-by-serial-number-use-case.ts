import { Asset } from '../../generated/prisma'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'

interface GetAssetSerialNumberRequest {
  serialNumber: string
}

interface GetAssetSerialNumberResponse {
  asset: Asset | null
}

export class GetAssetBySerialNumberUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute({
    serialNumber,
  }: GetAssetSerialNumberRequest): Promise<GetAssetSerialNumberResponse> {
    const asset = await this.assetRepository.findBySerialNumber(serialNumber)
    return { asset }
  }
}
