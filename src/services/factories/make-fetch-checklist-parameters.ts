import { PrismaChecklistRepository } from '../../repositories/prisma/prisma-checklist-repository'
import { FetchChecklistParametersUseCase } from '../checklist/fetch-checklist-parameters-use-case'

export function makeFetchChecklistParameters() {
  const repo = new PrismaChecklistRepository()
  return new FetchChecklistParametersUseCase(repo)
}
