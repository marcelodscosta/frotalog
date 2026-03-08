import { IChecklistRepository } from '../../repositories/interfaces/IChecklistRepository'

export class DeleteChecklistUseCase {
  constructor(private checklistRepository: IChecklistRepository) {}

  async execute(id: string) {
    const checklist = await this.checklistRepository.findChecklistById(id)
    if (!checklist) throw new Error('Checklist não encontrado')
    await this.checklistRepository.deleteChecklist(id)
  }
}
