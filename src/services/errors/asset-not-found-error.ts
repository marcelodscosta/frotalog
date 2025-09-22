import { AppError } from './app-error'

export class AssetNotFoundError extends AppError {
  constructor() {
    super(
      'Asset not found. Please check if the provided identifier is correct.',
      404,
    )
  }
}
