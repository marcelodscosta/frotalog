import { AppError } from './app-error'

export class AssetAlreadyInContractError extends AppError {
  constructor() {
    super(
      'Este equipamento já está ativo neste contrato. Desmobilize-o antes de adicioná-lo novamente.',
      409,
    )
  }
}
