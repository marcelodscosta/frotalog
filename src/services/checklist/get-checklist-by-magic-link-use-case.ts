import { IChecklistRepository } from '../../repositories/interfaces/IChecklistRepository'

export class GetChecklistByMagicLinkUseCase {
  constructor(private checklistRepository: IChecklistRepository) {}

  async execute(magicLinkId: string) {
    const checklist = await this.checklistRepository.findChecklistByMagicLink(magicLinkId)
    if (!checklist) throw new Error('Checklist não encontrado')
    if (!checklist.is_active) throw new Error('Checklist não disponível')
    return { checklist }
  }
}
