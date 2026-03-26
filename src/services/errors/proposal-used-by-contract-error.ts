import { AppError } from './app-error'

export class ProposalUsedByContractError extends AppError {
  constructor() {
    super('Não é possível excluir uma proposta que possui um contrato associado. Exclua o contrato primeiro.', 400)
  }
}
