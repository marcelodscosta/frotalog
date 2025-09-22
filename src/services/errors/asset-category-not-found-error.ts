import { AppError } from './app-error'

export class AssetCategoryNotFoundError extends AppError {
  constructor() {
    super('Asset category does not exist.', 404)
  }
}
