import { ProposalStatus } from '../../generated/prisma'
import { ICommercialProposalRepository } from '../../repositories/interfaces/ICommercialProposalRepository'

interface GetProposalsMetricsUseCaseRequest {
  query?: string
  status?: ProposalStatus
  clientId?: string
  startDate?: string
  endDate?: string
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
    startDate,
    endDate,
  }: GetProposalsMetricsUseCaseRequest): Promise<GetProposalsMetricsUseCaseResponse> {
    const metrics = await this.proposalsRepository.getMetrics({
      proposal_number: query,
      client: clientId,
      status,
      startDate,
      endDate,
    })

    return metrics
  }
}
