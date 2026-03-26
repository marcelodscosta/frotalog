import { AppError } from './app-error'

export class ProposalAlreadyExistsError extends AppError {
  constructor() {
    super('Já existe uma proposta comercial com este número.', 409)
  }
}
