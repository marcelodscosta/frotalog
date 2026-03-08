import { PrismaChecklistRepository } from '../../repositories/prisma/prisma-checklist-repository'
import { GetChecklistByMagicLinkUseCase } from '../checklist/get-checklist-by-magic-link-use-case'

export function makeGetChecklistByMagicLink() {
  const repo = new PrismaChecklistRepository()
  return new GetChecklistByMagicLinkUseCase(repo)
}
