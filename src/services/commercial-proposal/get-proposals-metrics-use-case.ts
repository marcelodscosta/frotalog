import { ProposalStatus } from '../../generated/prisma'
import { ICommercialProposalRepository } from '../../repositories/interfaces/ICommercialProposalRepository'

interface GetProposalsMetricsUseCaseRequest {
  query?: string
  status?: ProposalStatus
  clientId?: string
}

interface GetProposalsMetricsUseCaseResponse {
  totalCount: number
  totalValue: number
  approvedCount: number
  conversionRate: number
}

export class GetProposalsMetricsUseCase {
  constructor(private proposalsRepository: ICommercialProposalRepository) {}

  async execute({
    query,
    status,
    clientId,
  }: GetProposalsMetricsUseCaseRequest): Promise<GetProposalsMetricsUseCaseResponse> {
    const metrics = await this.proposalsRepository.getMetrics({
      proposal_number: query,
      client: clientId,
      status,
    })

    return metrics
  }
}
