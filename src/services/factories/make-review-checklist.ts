import { PrismaChecklistRepository } from '../../repositories/prisma/prisma-checklist-repository'
import { ReviewChecklistUseCase } from '../checklist/review-checklist-use-case'

export function makeReviewChecklist() {
  const repo = new PrismaChecklistRepository()
  return new ReviewChecklistUseCase(repo)
}
