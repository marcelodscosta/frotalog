import { CommercialProposal, ProposalStatus } from '../../generated/prisma'
import { ICommercialProposalRepository } from '../../repositories/interfaces/ICommercialProposalRepository'

interface SearchCommercialProposalsUseCaseRequest {
  page: number
  pageSize?: number
  query?: string
  status?: ProposalStatus
  clientId?: string
}

interface SearchCommercialProposalsUseCaseResponse {
  items: CommercialProposal[]
  totalItems: number
  totalPages: number
  currentPage: number
}

export class SearchCommercialProposalsUseCase {
  constructor(private proposalsRepository: ICommercialProposalRepository) {}

  async execute({
    page,
    query,
    status,
    clientId,
  }: SearchCommercialProposalsUseCaseRequest): Promise<SearchCommercialProposalsUseCaseResponse> {
    const result = await this.proposalsRepository.search({
      page,
      proposal_number: query,
      client: clientId,
      status,
    })

    return result
  }
}
