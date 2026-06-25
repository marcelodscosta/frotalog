import { PrismaCommercialProposalRepository } from '../../repositories/prisma/prisma-commercial-proposal-repository'
import { GetProposalsMetricsUseCase } from '../commercial-proposal/get-proposals-metrics-use-case'

export function makeGetProposalsMetrics() {
  const proposalsRepository = new PrismaCommercialProposalRepository()
  const useCase = new GetProposalsMetricsUseCase(proposalsRepository)

  return useCase
}
