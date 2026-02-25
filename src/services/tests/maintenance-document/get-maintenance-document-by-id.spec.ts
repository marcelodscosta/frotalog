import { beforeEach, it, expect, describe } from 'vitest'
import { InMemoryMaintenanceDocumentRepository } from '../../../repositories/in-memory/in-memory-maintenance-document-repository'
import { GetMaintenanceDocumentByIdUseCase } from '../../maintenance-document/get-maintenance-document-by-id-use-case'
import { MaintenanceDocumentNotFoundError } from '../../errors/maintenance-document-not-found-error'

let maintenanceDocumentRepository: InMemoryMaintenanceDocumentRepository
let getMaintenanceDocumentByIdUseCase: GetMaintenanceDocumentByIdUseCase

describe('Get Maintenance Document By Id', () => {
  beforeEach(() => {
    maintenanceDocumentRepository = new InMemoryMaintenanceDocumentRepository()
    getMaintenanceDocumentByIdUseCase = new GetMaintenanceDocumentByIdUseCase(
      maintenanceDocumentRepository,
    )
  })

  it('Should get a maintenance document by id', async () => {
    const createdDocument = await maintenanceDocumentRepository.create({
      Maintenance: { connect: { id: 'maintenance-01' } },
      filename: 'test.pdf',
      original_name: 'test.pdf',
      file_path: '/uploads/test.pdf',
      file_size: 1024,
      mime_type: 'application/pdf',
    })

    const { document } = await getMaintenanceDocumentByIdUseCase.execute({ id: createdDocument.id })

    expect(document.id).toEqual(createdDocument.id)
    expect(document.filename).toEqual('test.pdf')
  })

  it('Should not get a non-existent maintenance document', async () => {
    await expect(
      getMaintenanceDocumentByIdUseCase.execute({ id: 'non-existent' })
    ).rejects.toBeInstanceOf(MaintenanceDocumentNotFoundError)
  })
})
