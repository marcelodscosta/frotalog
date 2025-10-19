import { AppError } from './app-error'

export class MaintenanceNotFoundError extends AppError {
  constructor() {
    super('Maintenance not found', 404)
  }
}
