import { AppError } from './app-error'

export class InvalidFileTypeError extends AppError {
  constructor() {
    super('Invalid file type. Only PDF, images and documents are allowed', 400)
  }
}
