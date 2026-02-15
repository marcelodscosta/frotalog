import { AppError } from './app-error'

export class AssetMovimentNotFoundError extends AppError {
  constructor() {
    super(
      'Asset movement not found. Please check if the provided identifier is correct.',
      404,
    )
  }
}
