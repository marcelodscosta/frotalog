import { AppError } from './app-error'

export class ContractAlreadyExistsError extends AppError {
  constructor() {
    super(
      'Contract already exists, please verify the contract number and try again.',
      409,
    )
  }
}
