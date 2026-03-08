import { PrismaChecklistRepository } from '../../repositories/prisma/prisma-checklist-repository'
import { DeleteChecklistUseCase } from '../checklist/delete-checklist-use-case'

export function makeDeleteChecklist() {
  const repo = new PrismaChecklistRepository()
  return new DeleteChecklistUseCase(repo)
}
