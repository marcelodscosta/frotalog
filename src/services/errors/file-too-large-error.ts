import { AppError } from './app-error'

export class FileTooLargeError extends AppError {
  constructor() {
    super('File too large. Maximum size is 10MB', 400)
  }
}
