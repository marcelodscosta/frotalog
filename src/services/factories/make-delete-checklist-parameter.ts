import { PrismaChecklistRepository } from '../../repositories/prisma/prisma-checklist-repository'
import { DeleteChecklistParameterUseCase } from '../checklist/delete-checklist-parameter-use-case'

export function makeDeleteChecklistParameter() {
  const repo = new PrismaChecklistRepository()
  return new DeleteChecklistParameterUseCase(repo)
}
