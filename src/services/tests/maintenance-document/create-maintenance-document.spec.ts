import { beforeEach, it, expect, describe } from 'vitest'
import { InMemoryMaintenanceDocumentRepository } from '../../../repositories/in-memory/in-memory-maintenance-document-repository'
import { InMemoryMaintenanceRepository } from '../../../repositories/in-memory/in-memory-maintenance-repository'
import { CreateMaintenanceDocumentUseCase } from '../../maintenance-document/create-maintenance-document-use-case'
import { MaintenanceNotFoundError } from '../../errors/maintenance-not-found-error'
import { InvalidFileTypeError } from '../../errors/invalid-file-type-error'
import { FileTooLargeError } from '../../errors/file-too-large-error'

let maintenanceDocumentRepository: InMemoryMaintenanceDocumentRepository
let maintenanceRepository: InMemoryMaintenanceRepository
let createMaintenanceDocumentUseCase: CreateMaintenanceDocumentUseCase

describe('Create Maintenance Document', () => {
  beforeEach(() => {
    maintenanceDocumentRepository = new InMemoryMaintenanceDocumentRepository()
    maintenanceRepository = new InMemoryMaintenanceRepository()
    createMaintenanceDocumentUseCase = new CreateMaintenanceDocumentUseCase(
      maintenanceDocumentRepository,
      maintenanceRepository,
    )
  })

  it('Should create Maintenance Document', async () => {
    // Criar uma manutenção primeiro
    const maintenance = await maintenanceRepository.create({
      asset: { connect: { id: 'asset-01' } },
      supplier: { connect: { id: 'supplier-01' } },
      type: 'PREVENTIVE',
      description: 'Manutenção preventiva',
      scheduled_date: new Date(),
    })

    const { document } = await createMaintenanceDocumentUseCase.execute({
      maintenanceId: maintenance.id,
      filename: 'document.pdf',
      original_name: 'maintenance-report.pdf',
      file_path: '/uploads/document.pdf',
      file_size: 1024,
      mime_type: 'application/pdf',
      description: 'Relatório de manutenção',
    })

    expect(document.id).toEqual(expect.any(String))
    expect(document.filename).toBe('document.pdf')
    expect(document.original_name).toBe('maintenance-report.pdf')
    expect(document.mime_type).toBe('application/pdf')
  })

  it('Should not create Maintenance Document if maintenance does not exist', async () => {
    await expect(
      createMaintenanceDocumentUseCase.execute({
        maintenanceId: 'non-existent-id',
        filename: 'document.pdf',
        original_name: 'maintenance-report.pdf',
        file_path: '/uploads/document.pdf',
        file_size: 1024,
        mime_type: 'application/pdf',
      }),
    ).rejects.toBeInstanceOf(MaintenanceNotFoundError)
  })

  it('Should not create Maintenance Document with invalid file type', async () => {
    const maintenance = await maintenanceRepository.create({
      asset: { connect: { id: 'asset-01' } },
      supplier: { connect: { id: 'supplier-01' } },
      type: 'PREVENTIVE',
      description: 'Manutenção preventiva',
      scheduled_date: new Date(),
    })

    await expect(
      createMaintenanceDocumentUseCase.execute({
        maintenanceId: maintenance.id,
        filename: 'document.exe',
        original_name: 'malware.exe',
        file_path: '/uploads/document.exe',
        file_size: 1024,
        mime_type: 'application/x-executable',
      }),
    ).rejects.toBeInstanceOf(InvalidFileTypeError)
  })

  it('Should not create Maintenance Document with file too large', async () => {
    const maintenance = await maintenanceRepository.create({
      asset: { connect: { id: 'asset-01' } },
      supplier: { connect: { id: 'supplier-01' } },
      type: 'PREVENTIVE',
      description: 'Manutenção preventiva',
      scheduled_date: new Date(),
    })

    await expect(
      createMaintenanceDocumentUseCase.execute({
        maintenanceId: maintenance.id,
        filename: 'document.pdf',
        original_name: 'large-file.pdf',
        file_path: '/uploads/document.pdf',
        file_size: 11 * 1024 * 1024, // 11MB
        mime_type: 'application/pdf',
      }),
    ).rejects.toBeInstanceOf(FileTooLargeError)
  })
})
