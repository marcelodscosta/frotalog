import { AppError } from './app-error'

export class ClientNotFoundError extends AppError {
  constructor() {
    super(
      'Client not found. Please check if the provided identifier is correct.',
      404,
    )
  }
}
