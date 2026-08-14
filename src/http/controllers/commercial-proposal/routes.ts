import { FastifyInstance } from 'fastify'
import { createCommercialProposal } from './create-commercial-proposal-controller'
import { searchCommercialProposals } from './search-commercial-proposals-controller'
import { getCommercialProposal } from './get-commercial-proposal-controller'
import { updateCommercialProposal } from './update-commercial-proposal-controller'
import { convertProposalToContract } from './convert-proposal-to-contract-controller'
import { updateProposalStatus } from './update-proposal-status-controller'
import { fetchAllProposalsUnpaginated } from './fetch-all-proposals-unpaginated-controller'
import { deleteCommercialProposal } from './delete-commercial-proposal-controller'
import { getProposalsMetrics } from './get-proposals-metrics-controller'
import { requireEmployee } from '../../middleware/auth'

export async function commercialProposalRoutes(app: FastifyInstance) {
  app.post('/proposals', { preHandler: requireEmployee() }, createCommercialProposal)
  app.get('/proposals/all', { preHandler: requireEmployee() }, fetchAllProposalsUnpaginated)
  app.get('/proposals/metrics', { preHandler: requireEmployee() }, getProposalsMetrics)
  app.get('/proposals/search', { preHandler: requireEmployee() }, searchCommercialProposals)
  app.get('/proposals/:id', { preHandler: requireEmployee() }, getCommercialProposal)
  app.put('/proposals/:id', { preHandler: requireEmployee() }, updateCommercialProposal)
  app.patch('/proposals/:id/status', { preHandler: requireEmployee() }, updateProposalStatus)
  app.post('/proposals/convert', { preHandler: requireEmployee() }, convertProposalToContract)
  app.delete('/proposals/:id', { preHandler: requireEmployee() }, deleteCommercialProposal)
}
