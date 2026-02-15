import { AppError } from './app-error'

export class ContractNotFoundError extends AppError {
  constructor() {
    super(
      'Contract not found. Please check if the provided identifier is correct.',
      404,
    )
  }
}
