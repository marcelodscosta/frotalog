import { beforeEach, it, expect, describe } from 'vitest'
import { InMemoryMaintenanceDocumentRepository } from '../../../repositories/in-memory/in-memory-maintenance-document-repository'
import { DeleteMaintenanceDocumentUseCase } from '../../maintenance-document/delete-maintenance-document-use-case'
import { MaintenanceDocumentNotFoundError } from '../../errors/maintenance-document-not-found-error'

let maintenanceDocumentRepository: InMemoryMaintenanceDocumentRepository
let deleteMaintenanceDocumentUseCase: DeleteMaintenanceDocumentUseCase

describe('Delete Maintenance Document', () => {
  beforeEach(() => {
    maintenanceDocumentRepository = new InMemoryMaintenanceDocumentRepository()
    deleteMaintenanceDocumentUseCase = new DeleteMaintenanceDocumentUseCase(
      maintenanceDocumentRepository,
    )
  })

  it('Should delete a maintenance document', async () => {
    const document = await maintenanceDocumentRepository.create({
      Maintenance: { connect: { id: 'maintenance-01' } },
      filename: 'test.pdf',
      original_name: 'test.pdf',
      file_path: '/uploads/test.pdf',
      file_size: 1024,
      mime_type: 'application/pdf',
    })

    await deleteMaintenanceDocumentUseCase.execute({ id: document.id })

    const foundDocument = await maintenanceDocumentRepository.findById(document.id)
    expect(foundDocument).toBeNull()
  })

  it('Should not delete a non-existent maintenance document', async () => {
    await expect(
      deleteMaintenanceDocumentUseCase.execute({ id: 'non-existent' })
    ).rejects.toBeInstanceOf(MaintenanceDocumentNotFoundError)
  })
})
