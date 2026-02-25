import { beforeEach, it, expect, describe } from 'vitest'
import { InMemoryMaintenanceDocumentRepository } from '../../../repositories/in-memory/in-memory-maintenance-document-repository'
import { GetMaintenanceDocumentsByMaintenanceUseCase } from '../../maintenance-document/get-maintenance-documents-by-maintenance-use-case'

let maintenanceDocumentRepository: InMemoryMaintenanceDocumentRepository
let getMaintenanceDocumentsByMaintenanceUseCase: GetMaintenanceDocumentsByMaintenanceUseCase

describe('Get Maintenance Documents By Maintenance', () => {
  beforeEach(() => {
    maintenanceDocumentRepository = new InMemoryMaintenanceDocumentRepository()
    getMaintenanceDocumentsByMaintenanceUseCase = new GetMaintenanceDocumentsByMaintenanceUseCase(
      maintenanceDocumentRepository,
    )
  })

  it('Should get maintenance documents by maintenance id', async () => {
    for (let i = 1; i <= 22; i++) {
      await maintenanceDocumentRepository.create({
        Maintenance: { connect: { id: 'maintenance-01' } },
        filename: `test-${i}.pdf`,
        original_name: `test-${i}.pdf`,
        file_path: `/uploads/test-${i}.pdf`,
        file_size: 1024,
        mime_type: 'application/pdf',
      })
    }

    await maintenanceDocumentRepository.create({
      Maintenance: { connect: { id: 'maintenance-02' } },
      filename: `other.pdf`,
      original_name: `other.pdf`,
      file_path: `/uploads/other.pdf`,
      file_size: 1024,
      mime_type: 'application/pdf',
    })

    const { documents } = await getMaintenanceDocumentsByMaintenanceUseCase.execute({ 
      maintenanceId: 'maintenance-01', 
      page: 2 
    })

    expect(documents.items).toHaveLength(2)
    expect(documents.totalItems).toBe(22)
    expect(documents.currentPage).toBe(2)
  })
})
