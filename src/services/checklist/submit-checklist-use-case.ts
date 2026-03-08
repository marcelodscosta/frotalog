import { IChecklistRepository } from '../../repositories/interfaces/IChecklistRepository'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'
import { AssetReadingRepository } from '../../repositories/interfaces/asset-reading-repository'
import { AppError } from '../errors/app-error'

interface SubmitChecklistRequest {
  magicLinkId: string
  horometer?: number | null
  odometer?: number | null
  meterPhotoUrl?: string | null
  answers: {
    checklistItemTemplateId: string
    conforms: boolean
    notes?: string
    photoUrl?: string
  }[]
}

export class SubmitChecklistUseCase {
  constructor(
    private checklistRepository: IChecklistRepository,
    private assetRepository: IAssetRepository,
    private assetReadingsRepository: AssetReadingRepository,
  ) {}

  async execute(data: SubmitChecklistRequest) {
    const checklist = await this.checklistRepository.findChecklistByMagicLink(data.magicLinkId)
    if (!checklist) throw new AppError('Checklist não encontrado', 404)
    if (!checklist.is_active) throw new AppError('Checklist não disponível', 400)
    if (checklist.status === 'APPROVED') throw new AppError('Checklist já aprovado', 400)
    if (checklist.status === 'REVIEWING') throw new AppError('Checklist já enviado para revisão', 400)

    // Validation logic for meter readings
    if (
      (data.horometer === undefined || data.horometer === null) &&
      (data.odometer === undefined || data.odometer === null)
    ) {
      throw new AppError('É obrigatório informar o horímetro ou o odômetro do equipamento.', 400)
    }

    if (!data.meterPhotoUrl) {
      throw new AppError('A foto do painel indicando o horímetro/odômetro é obrigatória.', 400)
    }

    const asset = checklist.asset
    
    // Validate value isn't lower than current
    if (data.horometer !== undefined && data.horometer !== null && asset.current_horometer !== null) {
      if (data.horometer < asset.current_horometer) {
        throw new AppError(`O valor informado para o horímetro (${data.horometer}) não pode ser menor que o valor atual do equipamento (${asset.current_horometer}).`, 400)
      }
    }
    
    if (data.odometer !== undefined && data.odometer !== null && asset.current_odometer !== null) {
      if (data.odometer < asset.current_odometer) {
        throw new AppError(`O valor informado para o odômetro (${data.odometer}) não pode ser menor que o valor atual do equipamento (${asset.current_odometer}).`, 400)
      }
    }

    // Upsert all answers
    for (const answer of data.answers) {
      await this.checklistRepository.upsertAnswer({
        checklistId: checklist.id,
        checklistItemTemplateId: answer.checklistItemTemplateId,
        conforms: answer.conforms,
        notes: answer.notes,
        photoUrl: answer.photoUrl,
      })
    }

    // Record the system reading
    await this.assetReadingsRepository.create({
      assetId: asset.id,
      date: new Date(),
      horometer: data.horometer,
      odometer: data.odometer,
      notes: `Leitura registrada via checklist: ${checklist.checklistParameter.name}`,
      userId: null,
    })

    // Update the asset's current meter
    const dataToUpdate: any = {}
    if (data.horometer !== undefined && data.horometer !== null) {
      dataToUpdate.current_horometer = data.horometer
    }
    if (data.odometer !== undefined && data.odometer !== null) {
      dataToUpdate.current_odometer = data.odometer
    }
    
    if (Object.keys(dataToUpdate).length > 0) {
      await this.assetRepository.updateAsset(asset.id, dataToUpdate)
    }

    // Move to REVIEWING
    await this.checklistRepository.updateChecklist(checklist.id, {
      status: 'REVIEWING',
      completedAt: new Date(),
      horometer: data.horometer,
      odometer: data.odometer,
      meterPhotoUrl: data.meterPhotoUrl,
    })

    const updated = await this.checklistRepository.findChecklistById(checklist.id)
    return { checklist: updated }
  }
}
