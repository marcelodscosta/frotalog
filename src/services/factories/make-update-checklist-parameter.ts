import { PrismaChecklistRepository } from '../../repositories/prisma/prisma-checklist-repository'
import { UpdateChecklistParameterUseCase } from '../checklist/update-checklist-parameter-use-case'

export function makeUpdateChecklistParameter() {
  const repo = new PrismaChecklistRepository()
  return new UpdateChecklistParameterUseCase(repo)
}
