import { Asset } from '../../generated/prisma'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'

interface GetAssetPlateRequest {
  plate: string
}

interface GetAssetPlateResponse {
  asset: Asset | null
}

export class GetAssetByPlateUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute({
    plate,
  }: GetAssetPlateRequest): Promise<GetAssetPlateResponse> {
    const asset = await this.assetRepository.findByPlate(plate)
    return { asset }
  }
}
