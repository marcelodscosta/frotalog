import { PrismaChecklistRepository } from '../../repositories/prisma/prisma-checklist-repository'
import { CreateChecklistUseCase } from '../checklist/create-checklist-use-case'

export function makeCreateChecklist() {
  const repo = new PrismaChecklistRepository()
  return new CreateChecklistUseCase(repo)
}
