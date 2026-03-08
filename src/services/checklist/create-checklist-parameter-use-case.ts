import { IChecklistRepository } from '../../repositories/interfaces/IChecklistRepository'

interface CreateChecklistParameterRequest {
  name: string
  description?: string
  imageUrl?: string
  items: { description: string; order: number; requiresPhoto: boolean }[]
}

export class CreateChecklistParameterUseCase {
  constructor(private checklistRepository: IChecklistRepository) {}

  async execute(data: CreateChecklistParameterRequest) {
    const parameter = await this.checklistRepository.createParameter({
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      items: {
        create: data.items.map((i) => ({
          description: i.description,
          order: i.order,
          requiresPhoto: i.requiresPhoto,
        })),
      },
    })

    const full = await this.checklistRepository.findParameterById(parameter.id)
    return { parameter: full }
  }
}
