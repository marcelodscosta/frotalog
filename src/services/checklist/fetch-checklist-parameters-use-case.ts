import { IChecklistRepository } from '../../repositories/interfaces/IChecklistRepository'

export class FetchChecklistParametersUseCase {
  constructor(private checklistRepository: IChecklistRepository) {}

  async execute() {
    const parameters = await this.checklistRepository.findAllParameters()
    return { parameters }
  }
}
