import { IChecklistRepository } from '../../repositories/interfaces/IChecklistRepository'

interface UpdateChecklistParameterRequest {
  id: string
  name?: string
  description?: string
  imageUrl?: string
  items?: { id?: string; description: string; order: number; requiresPhoto: boolean }[]
}

export class UpdateChecklistParameterUseCase {
  constructor(private checklistRepository: IChecklistRepository) {}

  async execute(data: UpdateChecklistParameterRequest) {
    const existing = await this.checklistRepository.findParameterById(data.id)
    if (!existing) throw new Error('Parâmetro de checklist não encontrado')

    await this.checklistRepository.updateParameter(data.id, {
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
    })

    if (data.items) {
      const existingItemIds = existing.items.map((i) => i.id)
      const incomingItemIds = data.items.filter((i) => i.id).map((i) => i.id!)

      // Soft-delete items that were removed
      for (const existingId of existingItemIds) {
        if (!incomingItemIds.includes(existingId)) {
          await this.checklistRepository.deleteItem(existingId)
        }
      }

      // Update or create items
      for (const item of data.items) {
        if (item.id) {
          await this.checklistRepository.updateItem(item.id, {
            description: item.description,
            order: item.order,
            requiresPhoto: item.requiresPhoto,
          })
        } else {
          await this.checklistRepository.createItem({
            checklistParameterId: data.id,
            description: item.description,
            order: item.order,
            requiresPhoto: item.requiresPhoto,
          })
        }
      }
    }

    const updated = await this.checklistRepository.findParameterById(data.id)
    return { parameter: updated }
  }
}
