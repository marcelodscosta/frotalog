import { PrismaChecklistRepository } from '../../repositories/prisma/prisma-checklist-repository'
import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { PrismaAssetReadingsRepository } from '../../repositories/prisma/prisma-asset-readings-repository'
import { SubmitChecklistUseCase } from '../checklist/submit-checklist-use-case'

export function makeSubmitChecklist() {
  const checklistRepository = new PrismaChecklistRepository()
  const assetRepository = new PrismaAssetRepository()
  const assetReadingRepository = new PrismaAssetReadingsRepository()
  
  return new SubmitChecklistUseCase(
    checklistRepository,
    assetRepository,
    assetReadingRepository
  )
}
