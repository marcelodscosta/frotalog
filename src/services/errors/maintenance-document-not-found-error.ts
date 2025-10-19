import { AppError } from './app-error'

export class MaintenanceDocumentNotFoundError extends AppError {
  constructor() {
    super('Maintenance document not found', 404)
  }
}
