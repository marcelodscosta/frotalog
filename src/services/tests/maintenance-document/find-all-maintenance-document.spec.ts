import { beforeEach, it, expect, describe } from 'vitest'
import { InMemoryMaintenanceDocumentRepository } from '../../../repositories/in-memory/in-memory-maintenance-document-repository'
import { FindAllMaintenanceDocumentUseCase } from '../../maintenance-document/find-all-maintenance-document-use-case'

let maintenanceDocumentRepository: InMemoryMaintenanceDocumentRepository
let findAllMaintenanceDocumentUseCase: FindAllMaintenanceDocumentUseCase

describe('Find All Maintenance Documents', () => {
  beforeEach(() => {
    maintenanceDocumentRepository = new InMemoryMaintenanceDocumentRepository()
    findAllMaintenanceDocumentUseCase = new FindAllMaintenanceDocumentUseCase(
      maintenanceDocumentRepository,
    )
  })

  it('Should find all maintenance documents', async () => {
    for (let i = 1; i <= 22; i++) {
      await maintenanceDocumentRepository.create({
        Maintenance: { connect: { id: `maintenance-${i}` } },
        filename: `test-${i}.pdf`,
        original_name: `test-${i}.pdf`,
        file_path: `/uploads/test-${i}.pdf`,
        file_size: 1024,
        mime_type: 'application/pdf',
      })
    }

    const { documents } = await findAllMaintenanceDocumentUseCase.execute({ page: 2 })

    expect(documents.items).toHaveLength(2)
    expect(documents.totalItems).toBe(22)
    expect(documents.currentPage).toBe(2)
  })
})
