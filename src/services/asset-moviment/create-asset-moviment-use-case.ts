import { AssetMovement, BillingCycle, Prisma } from '../../generated/prisma'
import { IAssetMovementRepository } from '../../repositories/interfaces/IAssetMovimentRepository'
import { IAssetRepository } from '../../repositories/interfaces/IAssetRepository'
import { IContractRepository } from '../../repositories/interfaces/IContractRepository'
import { AssetNotFoundError } from '../errors/asset-not-found-error'
import { ContractNotFoundError } from '../errors/contract-not-fount-error'

interface CreateAssetMovementRequest {
  contractId: string
  assetId: string
  mobilization_date?: Date
  integration_date?: Date
  demobilization_date?: Date
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
