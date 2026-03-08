import { IChecklistRepository } from '../../repositories/interfaces/IChecklistRepository'

export class DeleteChecklistParameterUseCase {
  constructor(private checklistRepository: IChecklistRepository) {}

  async execute(id: string) {
    const existing = await this.checklistRepository.findParameterById(id)
    if (!existing) throw new Error('Parâmetro de checklist não encontrado')
    await this.checklistRepository.deleteParameter(id)
  }
}
