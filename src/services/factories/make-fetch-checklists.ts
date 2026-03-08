import { PrismaChecklistRepository } from '../../repositories/prisma/prisma-checklist-repository'
import { FetchChecklistsUseCase } from '../checklist/fetch-checklists-use-case'

export function makeFetchChecklists() {
  const repo = new PrismaChecklistRepository()
  return new FetchChecklistsUseCase(repo)
}
