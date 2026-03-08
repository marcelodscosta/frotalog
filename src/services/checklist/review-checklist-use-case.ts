import { IChecklistRepository } from '../../repositories/interfaces/IChecklistRepository'

interface ReviewChecklistRequest {
  checklistId: string
  approved: boolean
  rejectionNotes?: string
  reviewedBy: string
}

export class ReviewChecklistUseCase {
  constructor(private checklistRepository: IChecklistRepository) {}

  async execute(data: ReviewChecklistRequest) {
    const checklist = await this.checklistRepository.findChecklistById(data.checklistId)
    if (!checklist) throw new Error('Checklist não encontrado')

    if (data.approved) {
      await this.checklistRepository.updateChecklist(checklist.id, {
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewedBy: data.reviewedBy,
        rejectionNotes: null,
      })
    } else {
      await this.checklistRepository.updateChecklist(checklist.id, {
        status: 'REJECTED',
        reviewedAt: new Date(),
        reviewedBy: data.reviewedBy,
        rejectionNotes: data.rejectionNotes || 'Checklist reprovado',
      })
    }

    const updated = await this.checklistRepository.findChecklistById(checklist.id)
    return { checklist: updated }
  }
}
