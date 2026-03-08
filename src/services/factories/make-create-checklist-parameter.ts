import { PrismaChecklistRepository } from '../../repositories/prisma/prisma-checklist-repository'
import { CreateChecklistParameterUseCase } from '../checklist/create-checklist-parameter-use-case'

export function makeCreateChecklistParameter() {
  const repo = new PrismaChecklistRepository()
  return new CreateChecklistParameterUseCase(repo)
}
