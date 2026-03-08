import { IChecklistRepository } from '../../repositories/interfaces/IChecklistRepository'

export class FetchChecklistsUseCase {
  constructor(private checklistRepository: IChecklistRepository) {}

  async execute(filters?: { assetId?: string; type?: string; status?: string }) {
    const checklists = await this.checklistRepository.findAllChecklists(filters)
    return { checklists }
  }
}
