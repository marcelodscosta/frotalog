import { AppError } from './app-error'

export class ServiceCategoryNotFoundError extends AppError {
  constructor() {
    super('Service category not found.', 404)
  }
}
