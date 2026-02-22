import { AssetMovement, BillingCycle, Prisma } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { AssetNotFoundError } from '../errors/asset-not-found-error'
import { ContractNotFoundError } from '../errors/contract-not-fount-error'
import { AssetAlreadyInContractError } from '../errors/asset-already-in-contract-error'
import { AssetActiveInAnotherContractError } from '../errors/asset-active-in-another-contract-error'

interface CreateAssetMovementRequest {
  contractId: string
  assetId: string
  mobilization_date?: Date
  integration_date?: Date | null
  demobilization_date?: Date | null
  mobilization_checklist_url?: string | null
  demobilization_checklist_url?: string | null
  rental_value: number
  billing_cycle?: BillingCycle
  operator_name?: string | null
  current_horometer?: number | null
  current_odometer?: number | null
  delivery_location?: string | null
  freight_value?: number | null
  notes?: string | null
}

interface CreateAssetMovementResponse {
  assetMovement: AssetMovement
}

export class CreateAssetMovementUseCase {
  constructor(
    private assetMovementRepository: IAssetMovementRepository,
    private assetRepository: IAssetRepository,
    private contractRepository: IContractRepository,
  ) {}

  async execute(
    data: CreateAssetMovementRequest,
  ): Promise<CreateAssetMovementResponse> {
    const asset = await this.assetRepository.findById(data.assetId)
    if (!asset) throw new AssetNotFoundError()

    const contract = await this.contractRepository.findById(data.contractId)
    if (!contract) throw new ContractNotFoundError()

    // Verifica se o ativo já está ativo (sem desmobilização) no mesmo contrato
    const existingInSameContract =
      await this.assetMovementRepository.findActiveByAssetAndContract(
        data.assetId,
        data.contractId,
      )
    if (existingInSameContract) {
      throw new AssetAlreadyInContractError()
    }

    // Verifica se o ativo está ativo (sem desmobilização) em qualquer outro contrato
    const activeInAnotherContract =
      await this.assetMovementRepository.findActiveNotDemobilizedByAssetId(
        data.assetId,
      )
    if (activeInAnotherContract && activeInAnotherContract.contractId !== data.contractId) {
      throw new AssetActiveInAnotherContractError()
    }

    const assetMovement = await this.assetMovementRepository.create({
      ...data,
      rental_value: new Prisma.Decimal(data.rental_value),
      freight_value: data.freight_value
        ? new Prisma.Decimal(data.freight_value)
        : null,
    })

    return { assetMovement }
  }
}
