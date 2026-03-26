import { AppError } from './app-error'

export class ProposalNotApprovedError extends AppError {
  constructor() {
    super('Somente propostas com status "Aprovada" podem ser vinculadas a um contrato.', 400)
  }
}
