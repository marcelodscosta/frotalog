import { Prisma, CommercialProposal, ProposalStatus } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { ICommercialProposalRepository } from '../interfaces/ICommercialProposalRepository'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export class PrismaCommercialProposalRepository implements ICommercialProposalRepository {
  async create(data: Prisma.CommercialProposalUncheckedCreateInput): Promise<CommercialProposal> {
    const proposal = await prisma.commercialProposal.create({ data })
    return proposal
  }

  async updateProposal(
    id: string,
    data: Prisma.CommercialProposalUpdateInput,
  ): Promise<CommercialProposal> {
    const updateProposal = await prisma.commercialProposal.update({
      where: { id },
      data,
    })
    return updateProposal
  }

  async findById(id: string): Promise<CommercialProposal | null> {
    const proposal = await prisma.commercialProposal.findUnique({
      where: { id },
      include: {
        client: true,
      },
    })
    return proposal
  }

  async deleteProposal(id: string): Promise<CommercialProposal> {
    const proposal = await prisma.commercialProposal.update({
      where: { id },
      data: { is_active: false },
    })
    return proposal
  }

  async findAll(page: number): Promise<PaginatedResult<CommercialProposal>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const [proposals, totalCount] = await prisma.$transaction([
      prisma.commercialProposal.findMany({
        where: { is_active: true },
        skip,
        take: PAGE_SIZE,
        include: {
          client: true,
          items: true,
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.commercialProposal.count({ where: { is_active: true } }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: proposals,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findByClient(
    client: string,
    page: number,
  ): Promise<PaginatedResult<CommercialProposal>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const where: Prisma.CommercialProposalWhereInput = {
      is_active: true,
      client: {
        OR: [
          { company_name: { contains: client, mode: 'insensitive' } },
          { trading_name: { contains: client, mode: 'insensitive' } },
        ],
      },
    }

    const [proposals, totalCount] = await prisma.$transaction([
      prisma.commercialProposal.findMany({
        where,
        skip,
        take: PAGE_SIZE,
        include: { client: true, items: true },
        orderBy: { created_at: 'desc' },
      }),
      prisma.commercialProposal.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: proposals,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async findByProposalNumber(
    proposal_number: string,
  ): Promise<CommercialProposal | null> {
    return await prisma.commercialProposal.findUnique({
      where: { proposal_number },
      include: { client: true, items: true },
    })
  }

  async search({
    proposal_number,
    client,
    status,
    page,
  }: {
    proposal_number?: string
    client?: string
    status?: ProposalStatus
    page: number
  }): Promise<PaginatedResult<CommercialProposal>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE

    const where: Prisma.CommercialProposalWhereInput = {
      is_active: true,
    }

    if (proposal_number) {
      where.proposal_number = { contains: proposal_number, mode: 'insensitive' }
    }

    if (status) {
      where.status = status
    }

    if (client) {
      where.client = {
        OR: [
          { company_name: { contains: client, mode: 'insensitive' } },
          { trading_name: { contains: client, mode: 'insensitive' } },
        ],
      }
    }

    const [proposals, totalCount] = await prisma.$transaction([
      prisma.commercialProposal.findMany({
        where,
        skip,
        take: PAGE_SIZE,
        include: { client: true, items: true },
        orderBy: { created_at: 'desc' },
      }),
      prisma.commercialProposal.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    return {
      items: proposals,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems: totalCount,
      totalPages,
    }
  }

  async updateStatus(id: string, status: ProposalStatus): Promise<CommercialProposal> {
    const proposal = await prisma.commercialProposal.update({
      where: { id },
      data: { status },
    })
    return proposal
  }

  async getProposalWithDetails(id: string): Promise<CommercialProposal | null> {
    const proposal = await prisma.commercialProposal.findUnique({
      where: { id },
      include: {
        client: true,
        companySettings: true,
        items: {
          include: {
            asset: true,
            assetCategory: true,
          },
        },
      },
    })
    return proposal
  }
}
