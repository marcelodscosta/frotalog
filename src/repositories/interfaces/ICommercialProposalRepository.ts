import { Prisma, CommercialProposal, ProposalStatus } from '../../generated/prisma'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export interface ICommercialProposalRepository {
  create(data: Prisma.CommercialProposalUncheckedCreateInput): Promise<CommercialProposal>

  updateProposal(
    id: string,
    data: Prisma.CommercialProposalUpdateInput,
  ): Promise<CommercialProposal>

  findById(id: string): Promise<CommercialProposal | null>

  deleteProposal(id: string): Promise<CommercialProposal>

  findAll(page: number): Promise<PaginatedResult<CommercialProposal>>

  findByClient(client: string, page: number): Promise<PaginatedResult<CommercialProposal>>

  findByProposalNumber(proposal_number: string): Promise<CommercialProposal | null>

  search(params: {
    proposal_number?: string
    client?: string
    status?: ProposalStatus
    page: number
  }): Promise<PaginatedResult<CommercialProposal>>

  updateStatus(id: string, status: ProposalStatus): Promise<CommercialProposal>

  getProposalWithDetails(id: string): Promise<CommercialProposal | null>
}
