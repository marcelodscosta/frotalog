import { MaintenanceDocument } from '../../generated/prisma'
import { IMaintenanceDocumentRepository } from '../../repositories/interfaces/IMaintenanceDocumentRepository'
import { IMaintenanceRepository } from '../../repositories/interfaces/IMaintenanceRepository'
import { FileTooLargeError } from '../errors/file-too-large-error'
import { InvalidFileTypeError } from '../errors/invalid-file-type-error'
import { MaintenanceNotFoundError } from '../errors/maintenance-not-found-error'

interface CreateMaintenanceDocumentRequest {
  maintenanceId: string
  filename: string
  original_name: string
  file_path: string
  file_size: number
  mime_type: string
  description?: string
}

interface CreateMaintenanceDocumentResponse {
  document: MaintenanceDocument
}

export class CreateMaintenanceDocumentUseCase {
  constructor(
    private maintenanceDocumentRepository: IMaintenanceDocumentRepository,
    private maintenanceRepository: IMaintenanceRepository,
  ) {}

  async execute(data: CreateMaintenanceDocumentRequest): Promise<CreateMaintenanceDocumentResponse> {
    // Verificar se a manutenção existe
    const maintenance = await this.maintenanceRepository.findById(data.maintenanceId)
    if (!maintenance) {
      throw new MaintenanceNotFoundError()
    }

    // Validar tipo de arquivo
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // Video types (mobile app)
      'video/mp4',
      'video/quicktime',
      'video/webm',
      // Audio types (mobile app)
      'audio/m4a',
      'audio/mp4',
      'audio/mpeg',
      'audio/wav',
      'audio/aac',
      'audio/x-m4a',
    ]

    if (!allowedMimeTypes.includes(data.mime_type)) {
      throw new InvalidFileTypeError()
    }

    // Validar tamanho do arquivo (50MB - increased for video support)
    const maxFileSize = 50 * 1024 * 1024 // 50MB em bytes
    if (data.file_size > maxFileSize) {
      throw new FileTooLargeError()
    }

    const document = await this.maintenanceDocumentRepository.create({
      maintenanceId: data.maintenanceId,
      filename: data.filename,
      original_name: data.original_name,
      file_path: data.file_path,
      file_size: data.file_size,
      mime_type: data.mime_type,
      description: data.description,
    })

    return { document }
  }
}
