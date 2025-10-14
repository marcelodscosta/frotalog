import { AppError } from './app-error'

export class SupplierNotFoundError extends AppError {
  constructor() {
    super(
      'Supplier not found. Please check if the provided identifier is correct.',
      404,
    )
  }
}
