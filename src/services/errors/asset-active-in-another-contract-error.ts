import { AppError } from './app-error'

export class AssetActiveInAnotherContractError extends AppError {
  constructor() {
    super(
      'Este equipamento está ativo em outro contrato. Desmobilize-o antes de adicioná-lo a um novo contrato.',
      409,
    )
  }
}
