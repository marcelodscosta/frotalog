import { IChecklistRepository } from '../../repositories/interfaces/IChecklistRepository'
import { ChecklistType } from '../../generated/prisma'

interface CreateChecklistRequest {
  checklistParameterId: string
  assetId: string
  type: ChecklistType
  supplierId?: string | null
}

export class CreateChecklistUseCase {
  constructor(private checklistRepository: IChecklistRepository) {}

  async execute(data: CreateChecklistRequest) {
    const parameter = await this.checklistRepository.findParameterById(data.checklistParameterId)
    if (!parameter) throw new Error('Parâmetro de checklist não encontrado')

    const checklist = await this.checklistRepository.createChecklist({
      checklistParameterId: data.checklistParameterId,
      assetId: data.assetId,
      type: data.type,
      supplierId: data.supplierId,
    })

    const full = await this.checklistRepository.findChecklistById(checklist.id)
    return { checklist: full }
  }
}
