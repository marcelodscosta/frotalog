import { AppError } from '../errors/app-error'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'
import { AssetReadingRepository } from '../../repositories/interfaces/asset-reading-repository'

interface CreateAssetReadingRequest {
  assetId: string
  date: Date
  horometer?: number | null
  odometer?: number | null
  notes?: string | null
  userId?: string | null
}

export class CreateAssetReadingUseCase {
  constructor(
    private assetRepository: IAssetRepository,
    private assetReadingsRepository: AssetReadingRepository,
  ) {}

  async execute({
    assetId,
    date,
    horometer,
    odometer,
    notes,
    userId,
  }: CreateAssetReadingRequest) {
    const asset = await this.assetRepository.findById(assetId)

    if (!asset) {
      throw new AppError('Asset not found', 404)
    }

    if (horometer !== undefined && horometer !== null && asset.current_horometer !== null) {
      if (horometer <= asset.current_horometer) {
        throw new AppError(`O valor informado para o horímetro (${horometer}) não pode ser menor ou igual ao valor atual do equipamento (${asset.current_horometer}).`, 400)
      }
    }

    if (odometer !== undefined && odometer !== null && asset.current_odometer !== null) {
      if (odometer <= asset.current_odometer) {
        throw new AppError(`O valor informado para o odômetro (${odometer}) não pode ser menor ou igual ao valor atual do equipamento (${asset.current_odometer}).`, 400)
      }
    }

    // Create the reading record
    const reading = await this.assetReadingsRepository.create({
      assetId,
      date,
      horometer,
      odometer,
      notes,
      userId,
    })

    const dataToUpdate: any = {}
    
    if (horometer !== undefined && horometer !== null) {
      dataToUpdate.current_horometer = horometer
    }
    
    if (odometer !== undefined && odometer !== null) {
      dataToUpdate.current_odometer = odometer
    }
    
    if (Object.keys(dataToUpdate).length > 0) {
      await this.assetRepository.updateAsset(assetId, dataToUpdate)
    }

    return { reading }
  }
}
