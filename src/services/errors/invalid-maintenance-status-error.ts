import { AppError } from './app-error'

export class InvalidMaintenanceStatusError extends AppError {
  constructor() {
    super('Invalid maintenance status transition', 400)
  }
}
