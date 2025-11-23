import { AppError } from './app-error'

export class SupplierExistError extends AppError {
  constructor() {
    super(
      'Supplier with the provided CNPJ already exists. Please verify the CNPJ and try again.',
      409,
    )
  }
}
